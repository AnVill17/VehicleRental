// import path from "path";
// import { spawn } from "child_process";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// // Recreate __dirname in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const generateQuiz = async (req, res) => {
//   const { topic, difficulty, numQuestions } = req.body;

//   console.log("=== Incoming Quiz Request ===");
//   console.log("Topic:", topic);
//   console.log("Difficulty:", difficulty);
//   console.log("Num Questions:", numQuestions);

//   // Go up two levels from /Backend/src to /QuizProject, then into /Model
//   const scriptPath = path.join(__dirname, "..", "..", "Model", "generate_quiz.py");
//   console.log("Resolved Python Script Path:", scriptPath);

//   const pythonProcess = spawn("python", [
//     scriptPath,
//     topic,
//     difficulty,
//     numQuestions.toString(),
//   ]);

//   let data = "";
//   let error = "";

//   pythonProcess.stdout.on("data", (chunk) => {
//     data += chunk.toString();
//   });

//   pythonProcess.stderr.on("data", (chunk) => {
//     error += chunk.toString();
//   });

//   pythonProcess.on("close", (code) => {
//     console.log("Python script exited with code:", code);
//     if (code !== 0) {
//       console.error("Python stderr:", error);
//       return res.status(500).json({ error: "Python script failed", details: error });
//     }

//     try {
//       const questions = data.split("---SPLIT---").map(q => q.trim()).filter(Boolean);
//       res.json({ questions });
//     } catch (err) {
//       return res.status(500).json({ error: "Failed to parse Python output", details: err.message });
//     }
//   });
// };

// export default generateQuiz;
