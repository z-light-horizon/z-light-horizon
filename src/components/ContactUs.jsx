import { useState } from "react";
import BGImage from "../assets/imgs/ContactUSLetterBGImage.png";

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;
// const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw1XjZT-HEZSY9NQd23sDHCOdihJHsHXVFYio3KlcywSaUIVfkYZkL0k48UAb0lyXJ-Jw/exec";

const CLIENT_DAILY_LIMIT = 5;
const CLIENT_MONTHLY_LIMIT = 20;
const RAPID_FIRE_LIMIT = 5;
const RAPID_FIRE_WINDOW_MS = 60000; // 1 minute
const COOLDOWN_DURATION_MS = 300000; // 5 minutes

function getStoredData() {
  return JSON.parse(localStorage.getItem("contactSubmissions") || "{}");
}

function saveStoredData(data) {
  localStorage.setItem("contactSubmissions", JSON.stringify(data));
}

function checkClientRateLimit() {
  const now = new Date();
  const data = getStoredData();
  const submissions = data.submissions || [];
  const cooldownUntil = data.cooldownUntil || null;

  // Check if currently in cooldown
  if (cooldownUntil && now.getTime() < cooldownUntil) {
    return "cooldown";
  }

  const todayStr = now.toDateString();
  const thisMonth = `${now.getFullYear()}-${now.getMonth()}`;

  const daily = submissions.filter(
    (d) => new Date(d).toDateString() === todayStr
  );
  const monthly = submissions.filter((d) => {
    const dd = new Date(d);
    return `${dd.getFullYear()}-${dd.getMonth()}` === thisMonth;
  });

  // Rapid fire: submissions within the last 1 minute
  const rapidWindow = submissions.filter(
    (d) => now.getTime() - new Date(d).getTime() < RAPID_FIRE_WINDOW_MS
  );

  if (rapidWindow.length >= RAPID_FIRE_LIMIT) {
    const cooldownExpiry = now.getTime() + COOLDOWN_DURATION_MS;
    saveStoredData({ ...data, cooldownUntil: cooldownExpiry });
    return "cooldown";
  }

  if (daily.length >= CLIENT_DAILY_LIMIT) return "daily_limit";
  if (monthly.length >= CLIENT_MONTHLY_LIMIT) return "monthly_limit";

  return null;
}

function recordClientSubmission() {
  const data = getStoredData();
  const submissions = data.submissions || [];
  submissions.push(new Date().toISOString());

  // Keep only last 6 months to avoid localStorage bloat
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);
  const cleaned = submissions.filter((d) => new Date(d) > cutoff);

  saveStoredData({ ...data, submissions: cleaned });
}

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    notes: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    setErrorMsg("");

    if (!formData.name || !formData.email || !formData.notes) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    const limitHit = checkClientRateLimit();

    if (
      limitHit === "cooldown" ||
      limitHit === "daily_limit" ||
      limitHit === "monthly_limit"
    ) {
      setErrorMsg("Error sending. Please contact administrator.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        recordClientSubmission();
        setStatus("success");
        setFormData({ name: "", email: "", notes: "" });
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setErrorMsg("Error sending. Please contact administrator.");
        setStatus("idle");
      }
    } catch (err) {
      setErrorMsg("Error sending. Please contact administrator.");
      setStatus("idle");
    }
  };

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: `url(${BGImage})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-md p-8 pr-20">
        <h2
          className="text-5xl font-bold text-center mb-8 text-gray-800"
          style={{ fontFamily: "'Brush Script MT', cursive" }}
        >
          Contact Us
        </h2>

        <div className="space-y-4 pr-8">
          {/* Name Field */}
          <div className="flex items-center">
            <label
              htmlFor="name"
              className="text-4xl font-medium text-gray-800 mr-2 whitespace-nowrap"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength="30"
              disabled={isSubmitting}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 text-4xl overflow-hidden disabled:opacity-50"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
              placeholder="text here"
            />
          </div>

          {/* Email Field */}
          <div className="flex items-center">
            <label
              htmlFor="email"
              className="text-4xl font-medium text-gray-800 mr-2 whitespace-nowrap"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              maxLength="40"
              disabled={isSubmitting}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 text-4xl overflow-hidden disabled:opacity-50"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
              placeholder="text here"
            />
          </div>

          {/* Notes Field */}
          <div className="flex items-start">
            <label
              htmlFor="notes"
              className="text-4xl font-medium text-gray-800 mr-2 whitespace-nowrap"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              Notes:
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              maxLength="200"
              disabled={isSubmitting}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 text-4xl resize-none overflow-hidden disabled:opacity-50"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
              placeholder="text here"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p
              className="text-red-600 text-center text-lg"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              {errorMsg}
            </p>
          )}

          {/* Submit Button */}
          <div className="flex justify-center -ml-8">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-transparent border-none text-gray-800 text-5xl cursor-pointer transition duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              {isSubmitting
                ? "Sending..."
                : isSuccess
                ? "Sent! ✓"
                : "Write a letter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
