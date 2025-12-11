import { Check, CopyIcon, X } from "lucide-react";

function CopyLinkModal({
  setShowModal,
  shareLink,
  copyToClipboard,
  copied,
}: {
  setShowModal: (e: boolean) => void;
  shareLink: string;
  copyToClipboard: () => void;
  copied: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-3xl font-bold text-center text-primary mb-3">
          Opportunity Published!
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Your opportunity is live. You can share the link below:
        </p>

        <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100">
          <input
            value={shareLink}
            readOnly
            className="grow bg-transparent text-sm text-gray-700 outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="p-2 text-primary hover:bg-gray-200 rounded"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <CopyIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <button
          onClick={() => setShowModal(false)}
          className="mt-6 w-full bg-primary text-white font-semibold py-2 rounded hover:bg-primary/90 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default CopyLinkModal;
