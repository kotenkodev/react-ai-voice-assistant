function App() {
  return (
    <main>
      <h1 className="text-4xl text-blue-600 font-bold text-center">
        Virtual Assistant
      </h1>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <p>Listening</p>
          <button>Record</button>
        </div>
        <div>
          <p>Not Listening</p>
          <button>Stop</button>
        </div>
      </div>
    </main>
  );
}

export default App;
