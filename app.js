import connectDB from './services/mongo.connect.js';
import employeeSchema from './models/employeeSchema.js';
import tenantSchema from './models/tenantSchema.js';

const EmployeeSchemas = new Map([['employee', employeeSchema]]);
const TentantSchemas = new Map([['tenant', tenantSchema]]);

const switchDB = async (dbName, dbSchema) => {
  const mongoose = await connectDB();
  if (mongoose.connection.readyState === 1) {
    const db = mongoose.connection.useDb(dbName, { useCache: true });

    // Prevent from schema re-registration
    if (!Object.keys(db.models).length) {
      dbSchema.forEach((schema, modelName) => {
        db.model(modelName, schema);
      });
    }

    return db;
  }

  throw new Error('error');
};

const getDBModel = async (db, modelName) => {
  return db.model(modelName);
};

const initTenants = async () => {
  const tenantDB = await switchDB('AppTenants', TentantSchemas);
  const tenant = await getDBModel(tenantDB, 'tenant');
  await tenant.deleteMany({});

  const tenantA = await tenant.create({
    name: 'Steve',
    email: 'steve@example.com',
    password: 'secret',
    companyName: 'Apple',
  });
  const tenantB = await tenant.create({
    name: 'Bill',
    email: 'bill@example.com',
    password: 'secret',
    companyName: 'Microsoft',
  });
  const tenantC = await tenant.create({
    name: 'Jeff',
    email: 'jeff@example.com',
    password: 'secret',
    companyName: 'Amazon',
  });
};

const getAllTenants = async () => {
  const tenantDB = await switchDB('AppTenants', TentantSchemas);
  const tenantModel = await getDBModel(tenantDB, 'tenant');
  const tenants = await tenantModel.find({});

  return tenants;
};

const initEmployees = async () => {
  const customers = await getAllTenants();
  const createEmployees = customers.map(async (tenant) => {
    const companyDB = await switchDB(tenant.companyName, EmployeeSchemas);
    const employeeModel = await getDBModel(companyDB, 'employee');
    await employeeModel.deleteMany({});

    return employeeModel.create({
      employeeId: Math.floor(Math.random() * 10000).toString(),
      name: 'John',
      companyName: tenant.companyName,
    });
  });
  const results = await Promise.all(createEmployees);
};

const listAllEmployees = async () => {
  const customers = await getAllTenants();
  const mapCustomers = customers.map(async (tenant) => {
    const companyDB = await switchDB(tenant.companyName, EmployeeSchemas);
    const employeeModel = await getDBModel(companyDB, 'employee');
    return employeeModel.find({});
  });

  const results = await Promise.all(mapCustomers);
  return results;
};

(async function main() {
  await initTenants();
  await initEmployees();

  const tenants = await getAllTenants();
  const employees = await listAllEmployees();

  console.log(tenants);
  console.log(employees);
})();
