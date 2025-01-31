const sequelize = require('./sequelize')

const sql = {
    // Create a record
    create: async (table, data) => {
        try {
            const keys = Object.keys(data).join(', ');
            const placeholders = Object.keys(data).map((_, i) => `:param${i}`).join(', ');

            const query = `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`;
            const replacements = Object.fromEntries(Object.keys(data).map((key, i) => [`param${i}`, data[key]]));

            const [result] = await sequelize.query(query, { replacements });
            return result;
        } catch (error) {
            console.error(`Error creating record in table ${table}:`, error);
            throw error;
        }
    },

    // Read records
    read: async (table, where='1=1', replacements={}, joins=[], columns='*', orderBy='') => {
        try {
            if (!table) {
                throw new Error('Table name is required');
            }

            // Construct the JOIN clause
            const joinClause=joins
                .map(({ type='INNER', table: joinTable, on }) => `${type} JOIN ${joinTable} ON ${on}`)
                .join(' ');

            // Add ORDER BY clause if provided
            const orderByClause=orderBy? `ORDER BY ${orderBy}`:'';

            // Construct the full query
            const query=`SELECT ${columns} FROM ${table} ${joinClause} WHERE ${where} ${orderByClause}`;
            console.log('Executing query:', query);

            // Execute the query with replacements
            const [results]=await sequelize.query(query, { replacements });
            return results;
        } catch (error) {
            console.error(`Error reading records from table ${table}:`, error);
            throw error;
        }
    },


    // Update records
    update: async (table, data, where, replacements = {}) => {
        try {
            const updates = Object.keys(data)
                .map((key, i) => `${key} = :updateParam${i}`)
                .join(', ');
            const updateReplacements = Object.fromEntries(
                Object.keys(data).map((key, i) => [`updateParam${i}`, data[key]])
            );

            const query = `UPDATE ${table} SET ${updates} WHERE ${where}`;
            const [result] = await sequelize.query(query, {
                replacements: { ...replacements, ...updateReplacements },
            });
            return result;
        } catch (error) {
            console.error(`Error updating records in table ${table}:`, error);
            throw error;
        }
    },

    // Delete records
    delete: async (table, where, replacements = {}) => {
        try {
            const query = `DELETE FROM ${table} WHERE ${where}`;
            const [result] = await sequelize.query(query, { replacements });
            return result;
        } catch (error) {
            console.error(`Error deleting records from table ${table}:`, error);
            throw error;
        }
    },
};

module.exports = sql;