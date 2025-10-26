import { BookOpen, Gift } from "lucide-react";
import Link from "next/link";

export const EmailPreview = ({
  config,
  articles,
  opportunities,
  customText,
}) => {
  const {
    templateMode,
    subject,
    fromName,
    includeArticles,
    includeOpportunities,
  } = config;

  const ArticleBlock = ({ article }) => (
    <div className="mb-4 p-4 border-l-4 border-primary bg-white rounded-lg shadow-sm">
      <h4 className="text-lg font-bold text-gray-900 mb-1">{article.title}</h4>
      <p className="text-xs text-gray-500 mb-2">Published: {article.date}</p>
      <Link
        href={article.url}
        className="inline-block px-3 py-1 text-sm font-semibold text-white bg-primary rounded-full transition"
      >
        Read Article &rarr;
      </Link>
    </div>
  );

  const OpportunityBlock = ({ opp }) => (
    <div className="mb-4 p-4 bg-yellow-50 border-t-2 border-b-2 border-yellow-400 rounded-lg shadow-inner">
      <h4 className="text-lg font-bold text-gray-900 mb-1 flex items-center">
        <Gift className="w-5 h-5 mr-2 text-yellow-600" /> {opp.title}
      </h4>
      <p className="text-sm text-gray-600 mb-3">{opp.description}</p>
      <Link
        href="#"
        className="inline-block px-4 py-2 text-sm font-bold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition"
      >
        {opp.cta}
      </Link>
    </div>
  );

  if (templateMode === "plain") {
    return (
      <div className="p-8 bg-gray-50 rounded-xl border border-gray-300 shadow-inner min-h-[500px]">
        <p className="font-mono text-xs text-gray-500 mb-4 border-b pb-2">
          Plain Text Preview
        </p>
        <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
          {customText}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-0 bg-gray-200 min-h-[700px] rounded-xl overflow-hidden shadow-2xl">
      <div className="max-w-xl mx-auto my-8 border-8 border-gray-100 bg-white shadow-xl">
        {/* Email Header */}
        <div className="bg-primary text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-extrabold">
            {subject || "Untitled Campaign"}
          </h1>
          <p className="text-sm mt-1">From: {fromName || "Your Blog Team"}</p>
        </div>

        <div className="p-6">
          <div
            className="prose max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: customText.replace(/\n/g, "<br />"),
            }}
          />
        </div>

        {includeArticles && articles.length > 0 && (
          <div className="p-6 pt-0 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-primary" /> Latest Reads
            </h2>
            {articles.map((art) => (
              <ArticleBlock key={art.id} article={art} />
            ))}
            <p className="text-center text-sm mt-4 text-gray-500">
              <Link
                href="#"
                className="text-primary hover:underline font-medium"
              >
                View all articles on our blog &rarr;
              </Link>
            </p>
          </div>
        )}

        {includeOpportunities && opportunities.length > 0 && (
          <div className="p-6 pt-0 border-t border-gray-100 mt-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
              <Gift className="w-6 h-6 mr-2 text-yellow-600" /> Exclusive Offers
            </h2>
            {opportunities.map((opp) => (
              <OpportunityBlock key={opp.id} opp={opp} />
            ))}
          </div>
        )}

        <div className="bg-gray-100 p-6 text-center text-xs text-gray-500 rounded-b-lg mt-4">
          <p>
            You received this email because you are a subscriber on Techinika
            Blog.
          </p>
          <p className="mt-2">
            <Link href="#" className="text-gray-600 hover:text-primary">
              Unsubscribe
            </Link>{" "}
            |{" "}
            <Link href="#" className="text-gray-600 hover:text-primary">
              Manage Preferences
            </Link>
          </p>
          <p className="mt-2">
            Copyright &copy; {new Date().getFullYear()} Your Blog. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
