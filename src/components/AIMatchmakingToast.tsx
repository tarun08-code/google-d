import React, { useState, useEffect } from 'react';
import { X, Users, MessageCircle, Zap, ExternalLink } from 'lucide-react';
import { MatchSuggestion } from '../services/AIMatchmakingManager';

interface AIMatchmakingToastProps {
  suggestion: MatchSuggestion | null;
  onClose: () => void;
  onConnect: (suggestion: MatchSuggestion) => void;
  isVisible: boolean;
}

const AIMatchmakingToast: React.FC<AIMatchmakingToastProps> = ({
  suggestion,
  onClose,
  onConnect,
  isVisible
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible && suggestion) {
      setIsAnimating(true);
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, suggestion]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConnect = () => {
    if (suggestion) {
      onConnect(suggestion);
    }
    handleClose();
  };

  const getSuggestionIcon = () => {
    switch (suggestion?.suggestionType) {
      case 'collaboration':
        return <Users className="w-5 h-5 text-blue-400" />;
      case 'mentorship':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      default:
        return <MessageCircle className="w-5 h-5 text-green-400" />;
    }
  };

  const getSuggestionColor = () => {
    switch (suggestion?.suggestionType) {
      case 'collaboration':
        return 'border-blue-500/30 bg-blue-500/5';
      case 'mentorship':
        return 'border-yellow-500/30 bg-yellow-500/5';
      default:
        return 'border-green-500/30 bg-green-500/5';
    }
  };

  if (!isVisible || !suggestion) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`transform transition-all duration-300 ${
          isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className={`bg-gray-900/95 backdrop-blur-md border rounded-xl p-4 max-w-sm shadow-2xl ${
          getSuggestionColor()
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {getSuggestionIcon()}
              <div>
                <h3 className="text-white font-semibold text-sm">AI Matchmaking</h3>
                <p className="text-gray-400 text-xs capitalize">{suggestion.suggestionType || 'networking'} suggestion</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white p-1 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{suggestion.avatar || '👤'}</div>
              <div>
                <p className="text-white font-medium">{suggestion.name}</p>
                <p className="text-gray-300 text-sm mt-1">{suggestion.matchReason}</p>
              </div>
            </div>

            {/* Common Interests */}
            <div className="flex flex-wrap gap-1">
              {(suggestion.commonInterests || suggestion.interests || []).slice(0, 3).map((interest, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full border border-gray-700"
                >
                  {interest}
                </span>
              ))}
            </div>

            {/* Company & Role */}
            <div className="flex items-center text-gray-400 text-sm">
              <span>{suggestion.role}</span>
              {suggestion.company && (
                <>
                  <span className="mx-2">•</span>
                  <span>{suggestion.company}</span>
                </>
              )}
            </div>

            {/* Confidence Score */}
            {suggestion.confidenceScore && (
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#E63946] to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${suggestion.confidenceScore}%` }}
                  />
                </div>
                <span className="text-gray-400 text-xs">{suggestion.confidenceScore}% match</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={handleConnect}
                className="flex-1 bg-[#E63946] hover:bg-[#C5303E] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
              >
                <ExternalLink size={14} />
                <span>Connect</span>
              </button>
              <button
                onClick={handleClose}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMatchmakingToast;