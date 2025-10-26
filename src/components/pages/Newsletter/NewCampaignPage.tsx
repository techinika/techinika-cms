"use client";

import React, { useState } from "react";
import {
  Mail,
  Settings,
  User,
  Users,
  BookOpen,
  Gift,
  Text,
  Save,
  Send,
  Edit2,
  Zap,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmailPreview } from "@/components/parts/EmailPreview";

const MOCK_ARTICLES = [
  {
    id: 1,
    title: "The Future of AI in Content Creation",
    url: "#",
    date: "Oct 20, 2024",
  },
  {
    id: 2,
    title: "10 Tips for Optimizing Blog SEO",
    url: "#",
    date: "Oct 15, 2024",
  },
  {
    id: 3,
    title: "Understanding Google’s Latest Algorithm",
    url: "#",
    date: "Oct 01, 2024",
  },
];

const MOCK_OPPORTUNITIES = [
  {
    id: 10,
    title: "Exclusive Beta Access: New Feature X",
    description:
      "Be the first to try out our upcoming feature and provide feedback.",
    cta: "Join Beta Now",
  },
  {
    id: 11,
    title: "Free Webinar: Mastering the Platform",
    description:
      "Live training session on advanced features, hosted next week.",
    cta: "Register Today",
  },
];

export const AUDIENCE_OPTIONS = [
  {
    value: "subscribers",
    label: "Mailing List Subscribers",
    icon: Users,
    description:
      "Only people who have explicitly subscribed to your email list.",
  },
  {
    value: "users",
    label: "Registered Users",
    icon: User,
    description: "Only people registered on your blog/platform.",
  },
  {
    value: "all",
    label: "Users + Subscribers (Combined)",
    icon: Zap,
    description: "Send to everyone in both categories, ensuring no duplicates.",
  },
];

const NewCampaignPage = () => {
  const [config, setConfig] = useState({
    name: "Untitled Campaign",
    subject: "Your Latest Update: AI, SEO, and Exclusive Beta Access",
    fromName: "The Blog Team",
    templateMode: "structured",
    audience: "all",
    includeArticles: true,
    includeOpportunities: true,
  });
  const [customText, setCustomText] = useState(
    "Hi [Name],\n\nWe're thrilled to share our latest content and some exciting news about new features coming soon! Check out the details below."
  );
  const [selectedArticles, setSelectedArticles] = useState(
    MOCK_ARTICLES.slice(0, 2)
  );
  const [selectedOpportunities, setSelectedOpportunities] = useState(
    MOCK_OPPORTUNITIES.slice(0, 1)
  );

  const updateConfig = (key:string, value: boolean|string|number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveDraft = () => {
    console.log("Saving Draft:", {
      config,
      customText,
      selectedArticles,
      selectedOpportunities,
    });
    alert("Campaign Draft Saved Successfully!");
  };

  const handleSend = () => {
    if (!config.subject || !config.name) {
      alert("Please provide a name and subject before sending.");
      return;
    }
    alert(
      `Campaign '${config.name}' scheduled for sending to the '${config.audience}' audience!`
    );
  };

  const TemplateSelector = () => (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
        <Edit2 className="w-5 h-5 mr-2 text-purple-500" /> 1. Choose Template
        Mode
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => updateConfig("templateMode", "structured")}
          className={`p-5 rounded-xl border-4 cursor-pointer transition duration-200 ${
            config.templateMode === "structured"
              ? "border-purple-600 bg-purple-50 shadow-lg"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <Mail className="w-6 h-6 mb-2 text-purple-600" />
          <p className="font-semibold text-gray-800">
            Structured Layout (HTML)
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Full control over articles, opportunities, and beautiful formatting.
          </p>
        </div>
        <div
          onClick={() => updateConfig("templateMode", "plain")}
          className={`p-5 rounded-xl border-4 cursor-pointer transition duration-200 ${
            config.templateMode === "plain"
              ? "border-purple-600 bg-purple-50 shadow-lg"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <Text className="w-6 h-6 mb-2 text-purple-600" />
          <p className="font-semibold text-gray-800">Plain Text Mode</p>
          <p className="text-xs text-gray-500 mt-1">
            Simple, unformatted text for maximum deliverability and concise
            messages.
          </p>
        </div>
      </div>
    </div>
  );

  const ContentSelectionPanel = () => {
    const isStructured = config.templateMode === "structured";

    const toggleArticle = (article) => {
      setSelectedArticles((prev) =>
        prev.some((a) => a.id === article.id)
          ? prev.filter((a) => a.id !== article.id)
          : [...prev, article]
      );
    };
    const isArticleSelected = (article) =>
      selectedArticles.some((a) => a.id === article.id);

    return (
      <div
        className={`p-5 rounded-xl transition duration-300 ${
          isStructured
            ? "bg-white shadow-xl border border-gray-100"
            : "bg-gray-100 border border-dashed border-gray-300"
        }`}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-orange-500" /> 2. Content
          Blocks
        </h3>

        {!isStructured && (
          <p className="text-sm text-gray-500 p-3 bg-gray-200 rounded-lg">
            Content blocks are only available in **Structured Layout** mode.
          </p>
        )}

        <div
          className={`${
            isStructured
              ? "space-y-6"
              : "opacity-60 pointer-events-none space-y-6"
          }`}
        >
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <label className="text-gray-800 font-medium flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-primary" /> Include Blog
              Articles
            </label>
            <input
              type="checkbox"
              checked={config.includeArticles}
              onChange={() =>
                updateConfig("includeArticles", !config.includeArticles)
              }
              className="h-5 w-5 rounded text-primary border-gray-300 focus:ring-primary"
            />
          </div>

          {config.includeArticles && (
            <div className="pl-6 pt-2 space-y-2 border-l-2 border-blue-300 ml-2">
              <p className="text-sm font-semibold text-gray-600">
                Selected Articles ({selectedArticles.length}/
                {MOCK_ARTICLES.length})
              </p>
              {MOCK_ARTICLES.map((article) => (
                <div
                  key={article.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <span className="text-sm truncate">{article.title}</span>
                  <button
                    onClick={() => toggleArticle(article)}
                    className={`text-xs font-semibold py-1 px-2 rounded-full transition ${
                      isArticleSelected(article)
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {isArticleSelected(article) ? "Remove" : "Add"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <hr className="border-gray-100" />

          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <label className="text-gray-800 font-medium flex items-center">
              <Gift className="w-5 h-5 mr-2 text-yellow-600" /> Include
              Exclusive Opportunities
            </label>
            <input
              type="checkbox"
              checked={config.includeOpportunities}
              onChange={() =>
                updateConfig(
                  "includeOpportunities",
                  !config.includeOpportunities
                )
              }
              className="h-5 w-5 rounded text-yellow-600 border-gray-300 focus:ring-yellow-500"
            />
          </div>

          {config.includeOpportunities && (
            <div className="pl-6 pt-2 space-y-2 border-l-2 border-yellow-300 ml-2">
              <p className="text-sm font-semibold text-gray-600">
                Selected Opportunities ({selectedOpportunities.length}/
                {MOCK_OPPORTUNITIES.length})
              </p>
              {MOCK_OPPORTUNITIES.map((opp) => (
                <div
                  key={opp.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <span className="text-sm truncate">{opp.title}</span>
                  <button
                    onClick={() =>
                      setSelectedOpportunities((prev) =>
                        prev.some((o) => o.id === opp.id)
                          ? prev.filter((o) => o.id !== opp.id)
                          : [...prev, opp]
                      )
                    }
                    className={`text-xs font-semibold py-1 px-2 rounded-full transition ${
                      selectedOpportunities.some((o) => o.id === opp.id)
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {selectedOpportunities.some((o) => o.id === opp.id)
                      ? "Remove"
                      : "Add"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans">
      <div className="page">
        <Breadcrumb />

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
              <Mail className="w-7 h-7 mr-2 text-red-600" /> Create New Campaign
            </h1>
            <p className="text-gray-500 mt-1">
              Configure, design, and preview your email before sending.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSaveDraft}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-300 transition"
            >
              <Save className="w-5 h-5 mr-2" /> Save Draft
            </button>
            <button
              onClick={handleSend}
              className="flex items-center px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-lg transition transform hover:scale-[1.02]"
            >
              <Send className="w-5 h-5 mr-2" /> Send/Schedule
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-5 bg-white rounded-xl shadow-xl border border-gray-100 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-red-500" /> Campaign
                Settings
              </h2>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Campaign Name
                </span>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => updateConfig("name", e.target.value)}
                  placeholder="e.g., Q4 Newsletter"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Email Subject Line
                </span>
                <input
                  type="text"
                  value={config.subject}
                  onChange={(e) => updateConfig("subject", e.target.value)}
                  placeholder="What's your email about?"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  From Name (Sender)
                </span>
                <input
                  type="text"
                  value={config.fromName}
                  onChange={(e) => updateConfig("fromName", e.target.value)}
                  placeholder="Your Blog Team"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </label>
            </div>

            {/* Template Mode Selection */}
            <TemplateSelector />

            {/* Audience Selection */}
            <div className="p-5 bg-white rounded-xl shadow-xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-500" /> 3. Select
                Audience
              </h3>
              <div className="space-y-3">
                {AUDIENCE_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => updateConfig("audience", option.value)}
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition duration-150 ${
                      config.audience === option.value
                        ? "bg-green-50 border-green-500 ring-2 ring-green-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="audience-select"
                      checked={config.audience === option.value}
                      readOnly
                      className="mt-1 h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900 flex items-center">
                        <option.icon className="w-4 h-4 mr-2" /> {option.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Blocks Selection */}
            <ContentSelectionPanel />
          </div>

          {/* Column 2 & 3: Editor and Preview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Custom Text Editor */}
            <div className="p-5 bg-white rounded-xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Text className="w-5 h-5 mr-2 text-primary" /> Custom Message
                Editor
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Add your introductory text here. Use **[Name]** to simulate
                personalization.
              </p>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={config.templateMode === "plain" ? 20 : 8}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary resize-y"
                placeholder="Start typing your campaign message here..."
                style={{
                  minHeight:
                    config.templateMode === "plain" ? "400px" : "200px",
                }}
              />
            </div>

            {/* Email Preview */}
            <div className="relative">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-2 text-primary" /> Email Preview (
                {config.templateMode === "plain" ? "Plain Text" : "Structured"})
              </h2>
              <EmailPreview
                config={config}
                articles={selectedArticles}
                opportunities={selectedOpportunities}
                customText={customText}
              />
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  LIVE PREVIEW
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCampaignPage;
