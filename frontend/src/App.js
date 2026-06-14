import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [url, setUrl] = useState("");

  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [displayedSummary, setDisplayedSummary] = useState("");

  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(true);

  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);

  const stepProgress = {
    "Downloading audio...": 15,
    "Checking captions...": 35,
    "Using captions ⚡": 45,
    "Transcribing audio... 🐢": 60,
    "Generating summary...": 80,
    "Generating quiz...": 95,
  };

  const processVideo = () => {
    setPage("loading");
    setProgress(0);

    const es = new EventSource(
      `http://127.0.0.1:8000/process-video-stream?url=${encodeURIComponent(url)}`
    );

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.step) {
        setStatus(data.step);
        if (stepProgress[data.step]) {
          setProgress(stepProgress[data.step]);
        }
      }

      if (data.done) {
        setSummary(cleanSummary(data.summary));
        setQuiz(data.quiz);
        setProgress(100);
        setPage("summary");
        es.close();
      }
    };
  };

  const cleanSummary = (text) => {
    return text.trim();
  };

  useEffect(() => {
    if (page === "summary") {
      let i = 0;
      setDisplayedSummary("");

      const interval = setInterval(() => {
        setDisplayedSummary((prev) => prev + summary[i]);
        i++;
        if (i >= summary.length) clearInterval(interval);
      }, 2);

      return () => clearInterval(interval);
    }
  }, [summary, page]);

  const startQuiz = () => {
    setPage("quiz");
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
    setStartTime(Date.now());
  };

  const handleAnswer = (opt) => {
    if (showAnswer) return;

    setSelected(opt);
    setShowAnswer(true);

    if (opt === quiz[currentQ].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowAnswer(false);

    if (currentQ + 1 < quiz.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setTimeTaken(Math.floor((Date.now() - startTime) / 1000));
      setPage("result");
    }
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div
        className={`min-h-screen px-6 py-8 transition-colors duration-300 ${
          dark
            ? "bg-[#0f172a] text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center max-w-5xl mx-auto mb-10">
          <h1 className="text-2xl font-semibold">🎓 AI Study Assistant</h1>
          <button onClick={() => setDark(!dark)}>
            {dark ? <Sun /> : <Moon />}
          </button>
        </div>

        {/* HOME */}
        {page === "home" && (
          <div className="flex justify-center items-center h-[70vh]">
            <div
              className={`p-8 rounded-2xl w-full max-w-xl shadow-xl border ${
                dark
                  ? "bg-[#1e293b] border-gray-700"
                  : "bg-white border-gray-300"
              }`}
            >

              <h2 className="text-lg mb-4 text-gray-300">
                Paste YouTube Lecture Link
              </h2>

              <input
                className={`w-full p-3 rounded-lg border mb-4 ${
                  dark
                    ? "bg-[#0f172a] border-gray-600 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
                placeholder="https://youtube.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <button
                onClick={processVideo}
                className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700"
              >
                Generate
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {page === "loading" && (
          <div className="flex flex-col items-center mt-40">
            <p className="text-gray-300 mb-4">{status}</p>

            <div className="w-96 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="mt-2 text-sm text-gray-400">{progress}%</p>
          </div>
        )}

        {/* SUMMARY */}
        {page === "summary" && (
          <div
            className={`max-w-4xl mx-auto p-8 rounded-2xl border ${
              dark
                ? "bg-[#1e293b] border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >

            <h2 className="text-xl font-semibold mb-6 text-blue-400">
              📘 Summary
            </h2>

            <div
              className={`prose max-w-none leading-relaxed ${
                dark
                  ? "prose-invert text-gray-200"
                  : "text-gray-800"
              }`}
            >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {displayedSummary}
                  </ReactMarkdown>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700"
                onClick={startQuiz}
              >
                Start Quiz →
              </button>

              <button
                className="bg-gray-600 px-6 py-2 rounded-lg hover:bg-gray-700"
                onClick={() => setPage("home")}
              >
                ← Home
              </button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {page === "quiz" && quiz.length > 0 && (
          <div
            className={`max-w-3xl mx-auto p-8 rounded-2xl border ${
              dark
                ? "bg-[#1e293b] border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >

            <div className="flex justify-between mb-4">
              <h2>Question {currentQ + 1} / {quiz.length}</h2>
            </div>

            <p className="mb-6 text-lg text-gray-300">
              {quiz[currentQ].question}
            </p>

            {quiz[currentQ].options.map((opt, i) => {
              let style = "bg-[#0f172a] hover:bg-gray-700";

              if (showAnswer) {
                if (opt === quiz[currentQ].answer) {
                  style = "bg-green-600";
                } else if (opt === selected) {
                  style = "bg-red-600";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className={`block w-full text-left mb-3 p-3 rounded-lg ${style}`}
                >
                  {opt}
                </button>
              );
            })}

            {showAnswer && (
              <button
                className="mt-4 bg-blue-600 px-6 py-2 rounded-lg"
                onClick={nextQuestion}
              >
                Next →
              </button>
            )}
          </div>
        )}

        {/* RESULT */}
        {page === "result" && (
          <div className="text-center mt-20">

            <h2 className="text-2xl font-bold mb-4">
              🎉 Quiz Completed
            </h2>

            <p className="text-lg mb-2">
              Score: {score} / {quiz.length}
            </p>

            <p className="text-gray-400 mb-6">
              Time Taken: {timeTaken}s
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="bg-blue-600 px-6 py-2 rounded-lg"
                onClick={startQuiz}
              >
                🔁 Retry Quiz
              </button>

              <button
                className="bg-gray-600 px-6 py-2 rounded-lg"
                onClick={() => setPage("home")}
              >
                🏠 Home
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;