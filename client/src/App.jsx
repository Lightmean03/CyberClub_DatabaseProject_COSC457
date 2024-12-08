import React, { useState, useEffect } from 'react';
import {Typography} from "@mui/material";

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
      const response = await fetch('http://127.0.0.1:5000/api/tables'); // Switch from localhost:5000
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
      const response = await fetch('http://http://127.0.0.1:5000/api/query', {
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
    <div className="min-h-screen flex flex-col bg-gray-100" style={{
      backgroundSize:"cover",
      backgroundImage:`url('/mainImg.jpg')`,
      overflow:"visible"

    }}>
    
      {/* Header */}

      <div style={{
        width:"100%",
        height:"900px",
        overflow:"visible"
      }}>
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center" style={{
            backgroundColor:"yellow",
            border: "5px solid rgba(0, 0, 0, 0.1)", // Optional for a visible border
            borderRadius:"15px",
            alignItems:"center",
            top:"150px",
            position:"relative",
            opacity:".8"
          }}>
            <div style={{
              alignItems:"center",
              justifyContent:"center",
              justifyItems:"center"
            }}>
              <Typography className="nfFont" style={{
                fontSize:"48px"
              }}> TU Cyberdefense Club's Database </Typography>

              <Typography className="nfFont" style={{
                fontSize:"14px",
                position:"relative",
                top:"-5px"
              }}> The Towson CyberDefense Club's Database is a centralized platform designed to streamline the club's operations and foster collaboration among members. This database serves as a hub for managing personal profiles, tracking meetings, organizing events, and handling member permissions. Built with a focus on security and functionality, it empowers the club to efficiently coordinate activities, enhance member engagement, and maintain an organized record of all initiatives. </Typography>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg">
               
              </span>
            </div>
          </div>
        </div>
      </header>

      <div style={{
        width:"99%",
        height:"250px",
        position:"relative",
        top:"450px",
        backgroundColor:"black",
        border: "5px solid rgba(255, 255, 0, 1)", // Optional for a visible border
        borderRadius:"16px",
        opacity:".7",
        overflow:"auto"
      }}
      >
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6" >
            {/* Tables List */}
            <div className="bg-white rounded-lg shadow-md p-6">
            <Typography className="nfFont" style={{
                fontSize:"38px",
                fontWeight:"bold",
                alignSelf: "center",  // Centers vertically within a flex container
                justifyContent: "center", // Centers horizontally
                display: "flex",  // Make sure it's a flex container
                textAlign: "center", // Centers text inside the div
                color:"white"
              }}> Database Tables </Typography>
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

            <Typography className="nfFont" style={{
                fontSize:"22px",
                fontWeight:"bold",
                alignSelf: "center",  // Centers vertically within a flex container
                justifyContent: "center", // Centers horizontally
                display: "flex",  // Make sure it's a flex container
                textAlign: "center", // Centers text inside the div
                color:"white"
              }}> MYSQL Query  </Typography>
              <div className="space-y-4" style={{
                width:"100%",
                justifyItems:"center",
                alignItems:"center",
                display:"flex",
                position:"relative"
              }}>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your SQL query here..."
                  className="w-full h-40 p-4 text-sm font-mono border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  style={{
                    width:"97%",
                    height:"100px",
                    fontFamily:"'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
                    resize: "none",
                    borderRadius:"10px"
                  }}
                />
                <button
                  onClick={() => executeQuery()}
                  disabled={loading || !query.trim()}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  style={{
                    height:"100px",
                    borderRadius:"10px"
                  }}
               >
                  {loading ? 'Executing...' : 'Execute Query'}
                </button>
              </div>
            </div>

            {/* Query Results */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">

                <Typography className="nfFont" style={{
                  fontSize:"14px",
                  color:"white"
                }}>  
                  {error}
                </Typography>
              </div>
            )}

            {results && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                <Typography className="nfFont" style={{
                    fontSize:"22px",
                    fontWeight:"bold",
                    alignSelf: "center",  // Centers vertically within a flex container
                    justifyContent: "center", // Centers horizontally
                    display: "flex",  // Make sure it's a flex container
                    textAlign: "center", // Centers text inside the div
                    color:"white",
                    top: "20px",
                    position:"relative"
                }}>  

                Query Results
                </Typography>

                

                <Typography className="nfFont" style={{
                    fontSize:"15px",
                    fontWeight:"bold",
                    alignSelf: "center",  // Centers vertically within a flex container
                    justifyContent: "center", // Centers horizontally
                    display: "flex",  // Make sure it's a flex container
                    textAlign: "center", // Centers text inside the div
                    color:"white",
                    top: "20px",
                    position:"relative"
                }}>  
                    {results.length} {results.length === 1 ? 'row' : 'rows'} returned
                </Typography>


                </div>
                <div className="overflow-x-auto" style={{
                  alignSelf:"center",
                  justifyContent:"center",
                  position:"relative",
                  display:"flex",
                  top:"15px"
                }}>
                  {results.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(results[0]).map(key => (
                            <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               <Typography className="nfFont" style={{
                                      fontSize:"15px",
                                      fontWeight:"bold",
                                      alignSelf: "center",  // Centers vertically within a flex container
                                      justifyContent: "center", // Centers horizontally
                                      display: "flex",  // Make sure it's a flex container
                                      textAlign: "center", // Centers text inside the div
                                      color:"white",
                                      top: "20px",
                                      position:"relative"
                                }}>  
                                    {key}

                                </Typography>
                                
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            {Object.values(row).map((value, j) => (
                              <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                               <Typography className="nfFont" style={{
                                      fontSize:"15px",
                                      fontWeight:"bold",
                                      alignSelf: "left",  // Centers vertically within a flex container
                                      justifyContent: "left", // Centers horizontally
                                      display: "flex",  // Make sure it's a flex container
                                      textAlign: "left", // Centers text inside the div
                                      color:"white",
                                      top: "20px",
                                      position:"relative"
                                }}>  
                                  {value === null ? <span className="text-gray-400">NULL</span> : String(value)}

                                </Typography>

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

        
      </div>


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

      
    </div>
  );
}

export default App;
