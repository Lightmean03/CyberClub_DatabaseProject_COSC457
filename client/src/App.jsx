import React, { useState, useEffect } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const commonQueries = {
    showAll: (table) => `SELECT * FROM ${table} LIMIT 10;`,
    countAll: (table) => `SELECT COUNT(*) as total FROM ${table};`,
    describe: (table) => `DESCRIBE ${table};`,
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tables');
      if (!response.ok) throw new Error('Failed to fetch tables');
      const data = await response.json();
      setTables(data.tables || []);
    } catch (err) {
      setError('Failed to connect to the database server');
    }
  };

  const executeQuery = async (customQuery = null) => {
    const queryToExecute = customQuery || query;
    if (!queryToExecute.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToExecute }),
      });
      
      if (!response.ok) throw new Error('Query execution failed');
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setResults(null);
      } else {
        setResults(data.results || []);
        setError(null);
      }
    } catch (err) {
      setError('Failed to execute query');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Database Explorer</h1>
              <p className="text-purple-200">Manage your database with ease</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg">
                Connected to: localhost:3306
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tables List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Tables</h2>
              <div className="space-y-2">
                {tables.map(table => (
                  <div key={table} className="space-y-1">
                    <button
                      onClick={() => setSelectedTable(table)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedTable === table 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {table}
                    </button>
                    {selectedTable === table && (
                      <div className="pl-4 space-y-1">
                        <button
                          onClick={() => executeQuery(commonQueries.showAll(table))}
                          className="text-sm text-purple-600 hover:text-purple-800 block py-1"
                        >
                          Show All Records
                        </button>
                        <button
                          onClick={() => executeQuery(commonQueries.countAll(table))}
                          className="text-sm text-purple-600 hover:text-purple-800 block py-1"
                        >
                          Count Records
                        </button>
                        <button
                          onClick={() => executeQuery(commonQueries.describe(table))}
                          className="text-sm text-purple-600 hover:text-purple-800 block py-1"
                        >
                          Describe Structure
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Query Editor */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">SQL Query</h2>
              <div className="space-y-4">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your SQL query here..."
                  className="w-full h-40 p-4 text-sm font-mono border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  onClick={() => executeQuery()}
                  disabled={loading || !query.trim()}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Executing...' : 'Execute Query'}
                </button>
              </div>
            </div>

            {/* Query Results */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {results && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">Query Results</h2>
                  <p className="text-sm text-gray-600">
                    {results.length} {results.length === 1 ? 'row' : 'rows'} returned
                  </p>
                </div>
                <div className="overflow-x-auto">
                  {results.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(results[0]).map(key => (
                            <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            {Object.values(row).map((value, j) => (
                              <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {value === null ? <span className="text-gray-400">NULL</span> : String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Query executed successfully. No results to display.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;