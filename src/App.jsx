import { useEffect, useState } from "react";
import axios from "axios";

//passing props to child components and destructuring them 
//displaying fetched data in cards
function BreedCard({ name, description, life, weight, hypoallergenic }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 m-4 w-full max-w-xs border border-gray-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between min-h-[260px]">
      <h2 className="text-2xl font-bold mb-2 text-blue-800 tracking-tight flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
        {name}
      </h2>
      <p className="mb-3 text-gray-700 text-sm flex-1">{description || <span className="italic text-gray-400">No description</span>}</p>
      <div className="flex flex-col gap-1 text-xs text-gray-600 mt-2">
        <span><b>Lifespan:</b> {life || "Unknown"}</span>
        <span><b>Weight:</b> {weight || "Unknown"}</span>
        <span><b>Hypoallergenic:</b> <span className={hypoallergenic ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>{hypoallergenic ? "Yes" : "No"}</span></span>
      </div>
    </div>
  );
}

//fetching the data
function App() {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("https://dogapi.dog/api/v2/breeds")//uisng axios to fetch dog data
      .then((res) => {
        setBreeds(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch breeds");
        setLoading(false);
      });
  }, []);

  const filteredBreeds = breeds.filter((breed) =>
    breed.attributes.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Decorative background gradient and pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-blue-200 via-pink-100 to-purple-200 opacity-90"></div>
        <div className="w-full h-full absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent pointer-events-none"></div>
        <div className="w-full h-full absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-100/30 via-transparent to-transparent pointer-events-none"></div>
      </div>
      <header className="bg-white/80 shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight drop-shadow-sm">🐶 Dog Breed Explorer</h1>
          <input
            type="text"
            placeholder="Search breeds..."
            className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full md:w-72 transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-10">
        {loading && <div className="text-center text-lg animate-pulse">Loading...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}
        {!loading && !error && (
          <>
            {filteredBreeds.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">No breeds found:|</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                {filteredBreeds.map((breed) => (
                  <BreedCard
                    key={breed.id}
                    name={breed.attributes.name}
                    description={breed.attributes.description}
                    life={breed.attributes.life && breed.attributes.life.min && breed.attributes.life.max ? `${breed.attributes.life.min} - ${breed.attributes.life.max} years` : null}
                    weight={breed.attributes.weight && breed.attributes.weight.min && breed.attributes.weight.max ? `${breed.attributes.weight.min} - ${breed.attributes.weight.max} kg` : null}
                    hypoallergenic={breed.attributes.hypoallergenic}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      
      <footer className="text-center text-xs text-gray-500 py-6">
        &copy; {new Date().getFullYear()} Dog Breed Explorer. Built with React, Vite, and TailwindCSS for ete.
      </footer>
    </div>
  );
}

export default App;
