/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react';
import { credentialsAxios } from '../api/axios';

const VerifyCredential: React.FC = () => {
  const [credentialData, setCredentialData] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = JSON.parse(credentialData);
      const result = await credentialsAxios.post('/api/verify', data);
      setResponse(result.data);
      setError(null);
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || 'Invalid JSON format or error verifying credential');
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(credentialData);
      const formatted = JSON.stringify(parsed, null, 2);
      setCredentialData(formatted);
    } catch (err) {
      // Invalid JSON, do nothing
      console.log(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = credentialData.substring(0, start) + '  ' + credentialData.substring(end);
      setCredentialData(newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const lines = credentialData.substring(0, start).split('\n');
      const currentLine = lines[lines.length - 1];
      const indent = currentLine.match(/^\s*/)?.[0] || '';
      
      let extraIndent = '';
      if (currentLine.trim().endsWith('{') || currentLine.trim().endsWith('[')) {
        extraIndent = '  ';
      }
      
      const newValue = credentialData.substring(0, start) + '\n' + indent + extraIndent + credentialData.substring(start);
      setCredentialData(newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1 + indent.length + extraIndent.length;
        }
      }, 0);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Verify Credential
            </h1>
          </div>
          <p className="text-slate-300 text-lg">Validate and authenticate verifiable credentials</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          <div>
            {/* Input Section */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-slate-200 font-semibold text-lg">
                  Credential Data (JSON)
                </label>
                <button
                  onClick={formatJSON}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors duration-200 text-blue-300 text-sm"
                >
                  Format JSON
                </button>
              </div>
              <div className="relative group">
                <textarea
                  ref={textareaRef}
                  value={credentialData}
                  onChange={(e) => setCredentialData(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='{\n  "credential": "...",\n  "signature": "...",\n  "issuer": "..."\n}'
                  rows={12}
                  className="w-full bg-slate-900/80 text-cyan-300 font-mono text-sm p-6 rounded-xl border-2 border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 resize-none placeholder-slate-500 shadow-inner"
                  style={{ tabSize: 2 }}
                />
                <div className="absolute top-4 right-4 text-xs text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded">
                  JSON
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                Auto-indenting enabled • Press Tab for indent • Format button available
              </p>
            </div>

            {/* Submit Button */}
            <div className="px-8 pb-8">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !credentialData}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Credential
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mb-8 bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6 animate-shake">
              <div className="flex items-start gap-3">
                <div>
                  <h4 className="text-red-400 font-bold mb-1">Verification Failed</h4>
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Response */}
          {response && (
            <div className={`mx-8 mb-8 ${response.valid ? 'bg-green-500/10 border-green-500/50' : 'bg-yellow-500/10 border-yellow-500/50'} border-2 rounded-xl overflow-hidden animate-slide-up`}>
              <div className={`${response.valid ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20'} px-6 py-4 flex items-center justify-between border-b ${response.valid ? 'border-green-500/30' : 'border-yellow-500/30'}`}>
                <div className="flex items-center gap-3">
                  <h3 className={`${response.valid ? 'text-green-300' : 'text-yellow-300'} font-bold text-lg`}>
                    {response.valid ? 'Credential Verified Successfully' : 'Verification Complete'}
                  </h3>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-4 py-2 ${response.valid ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-yellow-500/20 hover:bg-yellow-500/30'} rounded-lg transition-colors duration-200`}
                >
                  <span className={`${response.valid ? 'text-green-300' : 'text-yellow-300'} text-sm font-medium`}>
                    {copied ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>
              <div className="p-6">
                <pre className={`${response.valid ? 'text-green-300' : 'text-yellow-300'} font-mono text-sm overflow-x-auto bg-slate-900/50 p-4 rounded-lg`}>
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400 text-sm">
          Powered by Kube Credential
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VerifyCredential;