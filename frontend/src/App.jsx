import { useEffect, useState } from "react";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [resolution, setResolution] = useState("");
  const [updating, setUpdating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const [creating, setCreating] = useState(false);

  const fetchIncidents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/incidents");

      if (!response.ok) {
        throw new Error("Failed to fetch incidents");
      }

      const data = await response.json();
      setIncidents(data);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async (e) => {
    e.preventDefault();

    if (!newTitle.trim() || !newDescription.trim()) {
      alert("Please enter title and description.");
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(
        "http://127.0.0.1:8000/incidents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTitle,
            description: newDescription,
            priority: newPriority,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create incident");
      }

      const newIncident = await response.json();

      setIncidents((currentIncidents) => [
        newIncident,
        ...currentIncidents,
      ]);

      setNewTitle("");
      setNewDescription("");
      setNewPriority("Medium");
      setShowCreateForm(false);

      alert("Incident created successfully!");

    } catch (error) {
      console.error("Error creating incident:", error);
      alert("Failed to create incident.");
    } finally {
      setCreating(false);
    }
  };

  const updateIncident = async () => {
    if (!selectedIncident) return;

    try {
      setUpdating(true);

      const response = await fetch(
        `http://127.0.0.1:8000/incidents/${selectedIncident.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
            priority: priority,
            resolution: resolution || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update incident");
      }

      const updatedIncident = await response.json();

      // Update incident in the list
      setIncidents((currentIncidents) =>
        currentIncidents.map((incident) =>
          incident.id === updatedIncident.id
            ? updatedIncident
            : incident
        )
      );

      // Update the selected incident
      setSelectedIncident(updatedIncident);

      alert("Incident updated successfully!");

    } catch (error) {
      console.error("Error updating incident:", error);
      alert("Failed to update incident.");
    } finally {
      setUpdating(false);
    }
  };

  const analyzeSelectedIncident = async () => {
    if (!selectedIncident) return;

    try {
      setAnalyzing(true);
      setAiAnalysis(null);

      const response = await fetch(
        `http://127.0.0.1:8000/incidents/${selectedIncident.id}/analyze`
      );

      if (!response.ok) {
        throw new Error("Failed to analyze incident");
      }

      const data = await response.json();
      setAiAnalysis(data);

    } catch (error) {
      console.error("AI analysis error:", error);
      alert("Unable to analyze incident.");
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || incident.status === filterStatus;

    const matchesPriority =
      filterPriority === "All" || incident.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                🛠️ SupportAI
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                AI-powered service desk
              </p>
            </div>

            <div className="text-sm text-slate-300">
              Support Engineer Dashboard
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-slate-500 text-sm">Total Incidents</p>
            <h2 className="text-3xl font-bold mt-2">
              {incidents.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-slate-500 text-sm">Open</p>
            <h2 className="text-3xl font-bold mt-2">
              {incidents.filter(
                (incident) => incident.status === "Open"
              ).length}
            </h2>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-slate-500 text-sm">In Progress</p>
            <h2 className="text-3xl font-bold mt-2">
              {incidents.filter(
                (incident) => incident.status === "In Progress"
              ).length}
            </h2>
          </div>

        </div>

        {/* Create Incident Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm border mb-8 p-6">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Create New Incident
              </h2>

              <button
                onClick={() => setShowCreateForm(false)}
                className="text-slate-500 hover:text-slate-900 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={createIncident} className="space-y-5">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title
                </label>

                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Users unable to login"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>

                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the technical issue..."
                  rows="4"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Priority
                </label>

                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="bg-slate-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Incident"}
              </button>

            </form>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm border">

          <div className="px-6 py-5 border-b">
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  📋 Support Incidents
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  View and manage reported technical issues.
                </p>
              </div>

              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700"
              >
                + New Incident
              </button>

            </div>
          </div>

          <div className="p-6">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

              {/* Search */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Search incidents..."
                className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
              />

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-lg px-4 py-3"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border rounded-lg px-4 py-3"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>

            </div>

            {loading ? (
              <p className="text-slate-500">
                Loading incidents...
              </p>
            ) : filteredIncidents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl">📭</p>
                <p className="text-slate-500 mt-3">
                  No matching incidents found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {filteredIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    onClick={() => {
                      setSelectedIncident(incident);
                      setStatus(incident.status);
                      setPriority(incident.priority);
                      setResolution(incident.resolution || "");
                    }}
                    className="border rounded-xl p-5 hover:shadow-md transition cursor-pointer"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>
                        <h3 className="font-semibold text-lg">
                          {incident.title}
                        </h3>

                        <p className="text-slate-500 text-sm mt-2">
                          {incident.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">

                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          {incident.priority}
                        </span>

                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {incident.status}
                        </span>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        </div>
        {/* Incident Details */}
        {selectedIncident && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border">

            <div className="px-6 py-5 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Incident #{selectedIncident.id}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Incident details and status
                </p>
              </div>

              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6">

              <h3 className="text-2xl font-bold">
                {selectedIncident.title}
              </h3>

              <div className="flex gap-3 mt-4">

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  {selectedIncident.priority}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {selectedIncident.status}
                </span>

              </div>

              <div className="mt-6">
                <h4 className="font-semibold">
                  Description
                </h4>

                <p className="text-slate-600 mt-2">
                  {selectedIncident.description}
                </p>
              </div>

              <div className="mt-6 border-t pt-6">

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">
                      🤖 AI Analysis
                    </h4>

                    <p className="text-sm text-slate-500 mt-1">
                      Analyze this incident using historical support-ticket data.
                    </p>
                  </div>

                  <button
                    onClick={analyzeSelectedIncident}
                    disabled={analyzing}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {analyzing ? "Analyzing..." : "✨ Analyze Incident"}
                  </button>
                </div>

                {aiAnalysis && (
                  <div className="mt-5 space-y-4">

                    {/* Category */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                      <p className="text-sm text-slate-500">
                        Category
                      </p>

                      <p className="font-semibold mt-1">
                        {aiAnalysis.category}
                      </p>
                    </div>

                    {/* Possible Cause */}
                    <div>
                      <p className="font-semibold">
                        🔎 Possible Cause
                      </p>

                      <p className="text-slate-600 mt-1">
                        {aiAnalysis.possible_cause}
                      </p>
                    </div>

                    {/* Recommended Actions */}
                    <div>
                      <p className="font-semibold">
                        🛠️ Recommended Actions
                      </p>

                      <ul className="list-disc ml-6 mt-2 text-slate-600 space-y-1">
                        {aiAnalysis.recommended_actions.map(
                          (action, index) => (
                            <li key={index}>{action}</li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Suggested Priority */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-sm text-slate-500">
                        Suggested Priority
                      </p>

                      <p className="font-semibold mt-1">
                        🚨 {aiAnalysis.suggested_priority}
                      </p>
                    </div>

                    {/* Dataset */}
                    {aiAnalysis.dataset_context && (
                      <p className="text-xs text-slate-400">
                        📊 Analysis informed by{" "}
                        {aiAnalysis.dataset_context.tickets_analyzed}{" "}
                        historical support tickets.
                      </p>
                    )}

                  </div>
                )}

              </div>
              <div className="mt-6 border-t pt-6">

                <h4 className="font-semibold text-lg">
                  Update Incident
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Priority
                    </label>

                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                </div>

                {/* Resolution */}
                <div className="mt-5">

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Resolution
                  </label>

                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Describe how this incident was resolved..."
                    rows="4"
                    className="w-full border rounded-lg px-3 py-2"
                  />

                </div>

                <button
                  onClick={updateIncident}
                  disabled={updating}
                  className="mt-5 bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Incident"}
                </button>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
