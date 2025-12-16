import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssessmentAPI from '../../RecruiterAdmin/api/generateAssessmentApi';

export default function Examination() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const candidateRaw = sessionStorage.getItem("candidateData");
        const candidate = candidateRaw ? JSON.parse(candidateRaw) : null;
        if (!candidate) {
          setJobs([
            {
              title: "No Examination Available",
              location: "—",
              description: "You have not been shortlisted for the test.",
              isActive: false,
              startDate: "—",
              startTime: "—",
              endDate: "—",
              endTime: "—",
            },
          ]);
          return;
        }

        // Use AssessmentAPI to fetch all finalized tests for candidate
        const candidateId = candidate._id || candidate.id;
        let finalisedTestResults = null;
        try {
          finalisedTestResults = await AssessmentAPI.getFinalizedTest(candidateId);
        } catch (apiErr) {
          console.error('Error fetching finalized test from AssessmentAPI:', apiErr);
        }
        console.log("Finalised test API result for candidate", candidateId, ":", finalisedTestResults);

        if (Array.isArray(finalisedTestResults) && finalisedTestResults.length > 0) {
          // Check if the only result is a null/empty object (API: no assessment found)
          const onlyNull = finalisedTestResults.length === 1 &&
            Object.values(finalisedTestResults[0]).every(
              v => v === null || v === undefined || v === ""
            );
          if (!onlyNull) {
            setJobs(finalisedTestResults.map(test => ({
              title: test.title || "Assessment",
              company: test.company,
              location: test.location || "API Response Check",
              workType: test.workType || "API Response Check",
              skills: Array.isArray(test.skills) ? test.skills : [],
              description: test.description || "This is an assessment for your role.",
              startDate: test.startDate || "Today",
              startTime: test.startTime || "10:00 AM",
              endDate: test.endDate || "—",
              endTime: test.endTime || "—",
              isActive: typeof test.isActive === 'boolean' ? test.isActive : true,
              questionSetId: test.questionSetId || test.question_set_id || "assessment",
              questions: Array.isArray(test.questions) ? test.questions : [],
              aiScore: test.aiScore !== null && test.aiScore !== undefined ? test.aiScore : null,
              aiExplanation: test.aiExplanation !== null && test.aiExplanation !== undefined ? test.aiExplanation : null
            })));
            return;
          }
        }
        // If not found or not eligible, show not shortlisted message
        setJobs([
          {
            title: "No Examination Available",
            location: "—",
            description: "You have not been shortlisted for the test.",
            isActive: false,
            startDate: "—",
            startTime: "—",
            endDate: "—",
            endTime: "—",
          },
        ]);
      } catch (err) {
        console.error("Error fetching assessment from backend", err);
        setJobs([
          {
            title: "No Assessment Found",
            location: "—",
            workType: "—",
            employmentMode: "—",
            description:
              "No assessment has been generated yet. Please check back later.",
            startDate: "—",
            startTime: "—",
            endDate: "—",
            endTime: "—",
            isActive: false,
          },
        ]);
      }
    };
    fetchAssessment();
  }, []);

  return (
    <div className="min-h-screen px-4 md:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Available Examinations
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-300 hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
          >
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>

              <p className="text-red-500 text-sm sm:text-base mb-4">{job.location}</p>

              {job.workType && (
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-3 py-1 text-xs sm:text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-xl">
                    {job.workType}
                  </span>

                  {/* <span className="px-3 py-1 text-xs sm:text-sm font-medium text-purple-700 bg-purple-50 border border-purple-300 rounded-xl">
                    {job.employmentMode}
                  </span> */}
                </div>
              )}

              <p className="text-gray-600 text-sm leading-relaxed mb-2">{job.description}</p>

              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 text-xs sm:text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-xl">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-2 text-sm sm:text-base mb-4">
                <div className="flex">
                  <span className="font-semibold text-gray-900 min-w-[100px]">From:</span>
                  <span className="text-gray-700 ml-2">
                    {job.startDate} at {job.startTime}
                  </span>
                </div>

                <div className="flex">
                  <span className="font-semibold text-gray-900 min-w-[100px]">To:</span>
                  <span className="text-gray-700 ml-2">
                    {job.endDate} at {job.endTime}
                  </span>
                </div>
              </div>
            </div>

            <hr />

            <div className="flex justify-end">
              <button
                onClick={() =>
                  navigate(`/Candidate-Dashboard/Examination/TestDetails/${job.questionSetId}`)
                }
                disabled={!job.isActive}
                className={`mt-2 w-[100px] py-2 rounded-2xl font-medium text-sm sm:text-base transition-all duration-300 ${
                  job.isActive
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Give Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
