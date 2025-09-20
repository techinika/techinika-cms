"use client";

import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

// This is a single, self-contained Next.js component for a blog's settings page.
// It uses Tailwind CSS classes for styling that matches the user's dashboard style.

const SettingsPage = () => {
  // Use state hooks to manage the form inputs for all settings.
  const [blogTitle, setBlogTitle] = useState("My Awesome Blog");
  const [tagline, setTagline] = useState("A place for great articles.");
  const [authorName, setAuthorName] = useState("John Doe");
  const [authorBio, setAuthorBio] = useState(
    "Passionate writer and tech enthusiast."
  );
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [siteLogoUrl, setSiteLogoUrl] = useState("");
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [analyticsId, setAnalyticsId] = useState("");
  const [metaDescription, setMetaDescription] = useState(
    "A collection of articles on various topics."
  );

  // New settings for Social Media, Comments, and Integrations
  const [enableComments, setEnableComments] = useState(true);
  const [requireCommentModeration, setRequireCommentModeration] =
    useState(false);
  const [twitterHandle, setTwitterHandle] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [enableSocialSharing, setEnableSocialSharing] = useState(true);
  const [enableNewsletter, setEnableNewsletter] = useState(false);
  const [customCss, setCustomCss] = useState("");

  const handleSave = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log("Saving settings...");
    const settings = {
      blogTitle,
      tagline,
      authorName,
      authorBio,
      postsPerPage,
      siteLogoUrl,
      darkModeEnabled,
      analyticsId,
      metaDescription,
      enableComments,
      requireCommentModeration,
      twitterHandle,
      linkedInUrl,
      githubUrl,
      enableSocialSharing,
      enableNewsletter,
      customCss,
    };
    console.log("Settings to be saved:", settings);
    alert("Settings saved successfully!");
  };

  const containerClasses = "min-h-screen p-8 md:p-12 bg-gray-50";
  const cardClasses = "max-w-7xl mx-auto";
  const sectionTitleClasses = "text-2xl font-bold my-4";
  const inputClasses =
    "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200";
  const labelClasses = "block text-sm font-medium mb-1";
  const checkboxClasses =
    "form-checkbox h-5 w-5 text-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors duration-200";

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold my-5">Blog Settings</h1>
          <Button type="submit">Save Settings</Button>
        </div>
        <form onSubmit={handleSave} className="space-y-10">
          <div>
            <h2 className={sectionTitleClasses}>General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className={labelClasses} htmlFor="blogTitle">
                  Blog Title
                </Label>
                <Input
                  type="text"
                  id="blogTitle"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <Label className={labelClasses} htmlFor="tagline">
                  Tagline
                </Label>
                <Input
                  type="text"
                  id="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="mt-6">
              <Label className={labelClasses} htmlFor="siteLogoUrl">
                Site Logo URL
              </Label>
              <Input
                type="text"
                id="siteLogoUrl"
                value={siteLogoUrl}
                onChange={(e) => setSiteLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <h2 className={sectionTitleClasses}>Display & UI</h2>
            <div className="flex items-center space-x-8">
              <Label className="flex items-center cursor-pointer">
                <Input
                  type="checkbox"
                  className={checkboxClasses}
                  checked={darkModeEnabled}
                  onChange={(e) => setDarkModeEnabled(e.target.checked)}
                />
                <span className="ml-2 text-sm font-medium">
                  Enable Dark Mode
                </span>
              </Label>
              <div className="flex items-center">
                <Label
                  className="text-sm font-medium mr-2"
                  htmlFor="postsPerPage"
                >
                  Posts Per Page
                </Label>
                <Input
                  type="number"
                  id="postsPerPage"
                  value={postsPerPage}
                  onChange={(e) => setPostsPerPage(Number(e.target.value))}
                  min="1"
                  className="w-20 "
                />
              </div>
            </div>
          </div>

          {/* SEO & Analytics Section */}
          <div>
            <h2 className={sectionTitleClasses}>SEO & Analytics</h2>
            <div className="space-y-6">
              <div>
                <Label className={labelClasses} htmlFor="analyticsId">
                  Google Analytics ID
                </Label>
                <Input
                  type="text"
                  id="analyticsId"
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className={inputClasses}
                />
              </div>
              <div>
                <Label className={labelClasses} htmlFor="metaDescription">
                  Default Meta Description
                </Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className={inputClasses}
                ></Textarea>
              </div>
            </div>
          </div>

          <div>
            <h2 className={sectionTitleClasses}>Comments</h2>
            <div className="flex items-center space-x-8">
              <Label className="flex items-center cursor-pointer">
                <Input
                  type="checkbox"
                  className={checkboxClasses}
                  checked={enableComments}
                  onChange={(e) => setEnableComments(e.target.checked)}
                />
                <span className="ml-2 text-sm font-medium">
                  Enable Comments
                </span>
              </Label>
              <Label className="flex items-center cursor-pointer">
                <Input
                  type="checkbox"
                  className={checkboxClasses}
                  checked={requireCommentModeration}
                  onChange={(e) =>
                    setRequireCommentModeration(e.target.checked)
                  }
                />
                <span className="ml-2 text-sm font-medium">
                  Require Moderation
                </span>
              </Label>
            </div>
          </div>

          <div>
            <h2 className={sectionTitleClasses}>Social Media</h2>
            <div className="space-y-6">
              <div>
                <Label className={labelClasses} htmlFor="twitterHandle">
                  Twitter Handle
                </Label>
                <Input
                  type="text"
                  id="twitterHandle"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="@yourhandle"
                  className={inputClasses}
                />
              </div>
              <div>
                <Label className={labelClasses} htmlFor="linkedInUrl">
                  LinkedIn URL
                </Label>
                <Input
                  type="text"
                  id="linkedInUrl"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  placeholder="https://linkedin.com/company/yourprofile"
                  className={inputClasses}
                />
              </div>
              <div>
                <Label className={labelClasses} htmlFor="githubUrl">
                  GitHub URL
                </Label>
                <Input
                  type="text"
                  id="githubUrl"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/yourprofile"
                  className={inputClasses}
                />
              </div>
              <Label className="flex items-center cursor-pointer mt-6">
                <Input
                  type="checkbox"
                  className={checkboxClasses}
                  checked={enableSocialSharing}
                  onChange={(e) => setEnableSocialSharing(e.target.checked)}
                />
                <span className="ml-2 text-sm font-medium">
                  Enable Social Sharing Buttons
                </span>
              </Label>
            </div>
          </div>

          {/* Advanced Integrations */}
          <div>
            <h2 className={sectionTitleClasses}>Advanced & Integrations</h2>
            <div className="space-y-6">
              <Label className="flex items-center cursor-pointer">
                <Input
                  type="checkbox"
                  className={checkboxClasses}
                  checked={enableNewsletter}
                  onChange={(e) => setEnableNewsletter(e.target.checked)}
                />
                <span className="ml-2 text-sm font-medium">
                  Enable Newsletter Subscription
                </span>
              </Label>
              <div>
                <Label className={labelClasses} htmlFor="customCss">
                  Custom CSS
                </Label>
                <Textarea
                  id="customCss"
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder="/* Add your custom CSS here */"
                  className={inputClasses}
                ></Textarea>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
