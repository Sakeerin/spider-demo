'use client';

import { useState } from 'react';
import { matchingApi, MatchResult, ContractorMatch } from '@/lib/api/matching';

interface MatchGeneratorProps {
  leadId: string;
  token: string;
  onMatchGenerated?: (result: MatchResult) => void;
}

export function MatchGenerator({
  leadId,
  token,
  onMatchGenerated,
}: MatchGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [maxMatches, setMaxMatches] = useState(3);

  const handleGenerateMatches = async () => {
    setLoading(true);
    setError(null);

    try {
      const matchResult = await matchingApi.generateMatches(token, {
        leadId,
        maxMatches,
      });

      setResult(matchResult);
      onMatchGenerated?.(matchResult);
    } catch (err: any) {
      setError(err.message || 'Failed to generate matches');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div>
          <label
            htmlFor="maxMatches"
            className="block text-sm font-medium text-gray-700"
          >
            Max Matches
          </label>
          <select
            id="maxMatches"
            value={maxMatches}
            onChange={(e) => setMaxMatches(Number(e.target.value))}
            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

        <button
          onClick={handleGenerateMatches}
          disabled={loading}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Matches'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold">{result.totalCandidates}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Match Confidence</p>
                <p
                  className={`text-2xl font-bold ${getConfidenceColor(result.confidence)}`}
                >
                  {result.confidence}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Matches Found</p>
                <p className="text-2xl font-bold">{result.matches.length}</p>
              </div>
            </div>
          </div>

          {result.matches.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                No contractors available for this lead. Try adjusting the
                criteria or contact contractors directly.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">
                Recommended Contractors
              </h3>
              {result.matches.map((match, index) => (
                <ContractorMatchCard
                  key={match.contractorId}
                  match={match}
                  rank={index + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ContractorMatchCardProps {
  match: ContractorMatch;
  rank: number;
}

function ContractorMatchCard({ match, rank }: ContractorMatchCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold">
              {rank}
            </span>
            <div>
              <h4 className="font-semibold text-gray-900">
                {match.contractor.businessName}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">
                  ⭐ {match.contractor.averageRating.toFixed(1)} (
                  {match.contractor.totalReviews} reviews)
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">
                  {match.contractor.experience} years exp.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            {match.reasoning.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <span className="text-green-500">✓</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">Success Rate:</span>
            <span className="text-xs font-medium">
              {match.contractor.successRate}%
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">Response Time:</span>
            <span className="text-xs font-medium">
              {match.contractor.responseTime} min
            </span>
          </div>
        </div>

        <div className="ml-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(match.score)}`}
          >
            Score: {match.score.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
