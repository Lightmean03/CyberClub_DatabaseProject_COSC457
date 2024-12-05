import { useState, useEffect } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  // Common queries dictionary
  const commonQueries = {
    showMembers: "SELECT cm.member_id, p.first_name, p.last_name, cm.role, cm.major, cm.year FROM club_member cm JOIN person p ON cm.person_id = p.person_id",
    showEvents: "SELECT event_name, date, time, meeting_format, expenses FROM event",
    showFaculty: "SELECT f.faculty_id, p.first_name, p.last_name, f.department, f.specialization FROM faculty f JOIN person p ON f.person_id = p.person_id",
    showProjects: "SELECT * FROM project",
    showEquipment: "SELECT * FROM club_equipment",
    showLocations: "SELECT * FROM location",
    showCompetitions: "SELECT e.event_name, c.category, c.prize, c.eligible FROM competition c JOIN event e ON c.event_id = e.event_id",
    showWorkshops: "SELECT e.event_name, w.topic, w.agenda FROM workshop w JOIN event e ON w.event_id = e.event_id"
  };

  // Quick actions for selected table
  const getTableActions = (tableName) => {
    return [
      { label: "View All", query: `SELECT * FROM ${tableName} LIMIT 10` },
      { label: "Count Records", query: `SELECT COUNT(*) as total FROM ${tableName}` },
      { label: "Latest 5", query: `SELECT * FROM ${tableName} ORDER BY ${tableName}_id DESC LIMIT 5` }
    ];
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('sqlapi.tucyber.club/api/tables');
        if (!response.ok) throw new Error('Failed to fetch tables');
        const data = await response.json();
        setTables(data.tables || []);
      } catch (err) {
        console.error('Error fetching tables:', err);
        setError('Failed to connect to the database server');
      }
    };
    fetchTables();
  }, []);

  const executeQuery = async (queryToExecute = query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://sqlapi.tucyber.club/api/query', {
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
      console.error('Error executing query:', err);
      setError('Failed to execute query. Please check your database connection.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Common Queries Section */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Quick Views</h3>
              <div className="space-y-2">
                <button
                  onClick={() => executeQuery(commonQueries.showMembers)}
                  className="w-full text-left px-3 py-2 rounded bg-blue-50 hover:bg-blue-100"
                >
                  View Club Members
                </button>
                <button
                  onClick={() => executeQuery(commonQueries.showEvents)}
                  className="w-full text-left px-3 py-2 rounded bg-blue-50 hover:bg-blue-100"
                >
                  View Events
                </button>
                <button
                  onClick={() => executeQuery(commonQueries.showFaculty)}
                  className="w-full text-left px-3 py-2 rounded bg-blue-50 hover:bg-blue-100"
                >
                  View Faculty
                </button>
                <button
                  onClick={() => executeQuery(commonQueries.showProjects)}
                  className="w-full text-left px-3 py-2 rounded bg-blue-50 hover:bg-blue-100"
                >
                  View Projects
                </button>
                <button
                  onClick={() => executeQuery(commonQueries.showCompetitions)}
                  className="w-full text-left px-3 py-2 rounded bg-blue-50 hover:bg-blue-100"
                >
                  View Competitions
                </button>
                <button
                  onClick={() => executeQuery(commonQueries.showWorkshops)}
                  className="w-full text-left px-3 py-2 rounded bg-blue-50 hover:bg-blue-100"
                >
                  View Workshops
                </button>
              </div>
            </div>

            {/* Tables Browser */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Tables Browser</h3>
              <div className="space-y-2">
                {tables.map(table => (
                  <div key={table} className="space-y-1">
                    <button
                      onClick={() => setSelectedTable(table)}
                      className={`w-full text-left px-3 py-2 rounded ${
                        selectedTable === table ? 'bg-blue-500 text-white' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {table}
                    </button>
                    {selectedTable === table && (
                      <div className="pl-4 space-y-1">
                        {getTableActions(table).map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => executeQuery(action.query)}
                            className="w-full text-left px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Custom Query Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Custom Query</h2>
              <div className="mb-4">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your SQL query here..."
                  className="w-full min-h-[100px] p-3 font-mono border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <button 
                onClick={() => executeQuery()}
                disabled={loading || !query.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Executing...' : 'Execute Query'}
              </button>
            </div>

            {/* Results Section */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {results && results.length > 0 && (
              <div className="bg-white shadow-md rounded-lg p-6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        {Object.keys(results[0]).map(key => (
                          <th key={key} className="p-3 border text-left font-medium text-gray-700">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, i) => (
                        <tr key={i} className="even:bg-gray-50">
                          {Object.values(row).map((value, j) => (
                            <td key={j} className="p-3 border">
                              {value === null ? 'NULL' : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {results && results.length === 0 && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <p className="text-center text-gray-700">Query executed successfully. No results to display.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;