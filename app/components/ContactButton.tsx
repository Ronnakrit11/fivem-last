"use client";

import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ContactButtonData {
  id: string;
  name: string;
  link: string;
  icon: string | null;
  qrCodeUrl: string | null;
  isActive: boolean;
}

export default function ContactButton() {
  const [buttons, setButtons] = useState<ContactButtonData[]>([]);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedButton, setSelectedButton] = useState<ContactButtonData | null>(null);

  useEffect(() => {
    fetch("/api/contact-buttons")
      .then(res => res.json())
      .then(data => {
        if (data.buttons) {
          setButtons(data.buttons);
        }
      })
      .catch(err => console.error("Error fetching contact buttons:", err));
  }, []);

  const handleButtonClick = (button: ContactButtonData) => {
    if (button.qrCodeUrl) {
      setSelectedButton(button);
      setShowQrModal(true);
    } else if (button.link) {
      window.open(button.link, "_blank", "noopener,noreferrer");
    }
  };

  // If no buttons from database, show default
  if (buttons.length === 0) {
    return (
      <a
        href="https://lin.ee/S8gD0y6"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="ติดต่อเรา"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full group-hover:bg-purple-400/40 transition-all duration-300"></div>
          <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white p-4 rounded-full shadow-lg shadow-purple-500/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-400/60">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900/95 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            ติดต่อเรา
          </div>
        </div>
      </a>
    );
  }

  return (
    <>
      {/* Contact Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleButtonClick(button)}
            className="group relative"
            aria-label={button.name}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full group-hover:bg-purple-400/40 transition-all duration-300"></div>
              
              {/* Button */}
              <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white p-4 rounded-full shadow-lg shadow-purple-500/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-400/60 overflow-hidden">
                {button.icon ? (
                  <img src={button.icon} alt={button.name} className="w-6 h-6 object-cover" />
                ) : (
                  <MessageCircle className="w-6 h-6" />
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900/95 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {button.name}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* QR Code Modal */}
      {showQrModal && selectedButton && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{selectedButton.name}</h3>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* QR Code Image */}
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <img 
                  src={selectedButton.qrCodeUrl!} 
                  alt={`QR Code - ${selectedButton.name}`}
                  className="w-full h-auto"
                />
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">
                สแกน QR Code เพื่อติดต่อเรา
              </p>

              {selectedButton.link && (
                <a
                  href={selectedButton.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mt-4 px-4 py-3 bg-purple-600 text-white text-center rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  เปิดลิงก์
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
