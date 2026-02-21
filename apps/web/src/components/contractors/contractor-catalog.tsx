'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ContractorPreview,
  formatBudgetRange,
  formatServiceLabel,
} from '@/lib/content/public-content';

type BudgetFilter = 'all' | 'starter' | 'growth' | 'premium';

interface ContractorCatalogProps {
  contractors: ContractorPreview[];
  initialQuery?: string;
}

interface ScoredContractor {
  contractor: ContractorPreview;
  score: number;
}

const budgetFilterLabels: Record<BudgetFilter, string> = {
  all: 'Any budget',
  starter: 'Up to THB 250K',
  growth: 'THB 250K - 900K',
  premium: 'THB 900K+',
};

function matchesBudget(contractor: ContractorPreview, budget: BudgetFilter) {
  if (budget === 'all') {
    return true;
  }

  if (budget === 'starter') {
    return contractor.budgetMin <= 250000;
  }

  if (budget === 'growth') {
    return contractor.budgetMin <= 900000 && contractor.budgetMax >= 250000;
  }

  return contractor.budgetMax >= 900000;
}

function tokenize(query: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function scoreContractor(
  contractor: ContractorPreview,
  tokens: string[]
): number {
  const normalized = {
    name: contractor.name.toLowerCase(),
    headline: contractor.headline.toLowerCase(),
    city: contractor.city.toLowerCase(),
    services: contractor.serviceSlugs.map((slug) =>
      formatServiceLabel(slug).toLowerCase()
    ),
    trustSignals: contractor.trustSignals.map((signal) => signal.toLowerCase()),
  };

  const keywordScore = tokens.reduce((total, token) => {
    let tokenScore = 0;

    if (normalized.name.includes(token)) {
      tokenScore += 40;
    }
    if (normalized.headline.includes(token)) {
      tokenScore += 24;
    }
    if (normalized.city.includes(token)) {
      tokenScore += 18;
    }
    if (normalized.services.some((service) => service.includes(token))) {
      tokenScore += 22;
    }
    if (normalized.trustSignals.some((signal) => signal.includes(token))) {
      tokenScore += 8;
    }

    return total + tokenScore;
  }, 0);

  const qualityScore =
    contractor.rating * 5 +
    contractor.successRate * 0.35 +
    contractor.yearsExperience * 1.2 +
    Math.min(contractor.reviews, 180) * 0.12;

  return keywordScore + qualityScore;
}

export function ContractorCatalog({
  contractors,
  initialQuery = '',
}: ContractorCatalogProps) {
  const [query, setQuery] = useState(initialQuery);
  const [serviceFilter, setServiceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('all');
  const [minRating, setMinRating] = useState(4);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const serviceOptions = useMemo(() => {
    const unique = new Set<string>();

    contractors.forEach((contractor) => {
      contractor.serviceSlugs.forEach((slug) => {
        unique.add(slug);
      });
    });

    return Array.from(unique).sort();
  }, [contractors]);

  const filtered = useMemo(() => {
    const tokens = tokenize(query);

    const scored: ScoredContractor[] = contractors
      .filter((contractor) => {
        const serviceMatch =
          serviceFilter === 'all' ||
          contractor.serviceSlugs.includes(serviceFilter);
        const locationMatch = contractor.city
          .toLowerCase()
          .includes(locationFilter.trim().toLowerCase());
        const ratingMatch = contractor.rating >= minRating;
        const budgetMatch = matchesBudget(contractor, budgetFilter);

        if (tokens.length === 0) {
          return serviceMatch && locationMatch && ratingMatch && budgetMatch;
        }

        const searchableText = [
          contractor.name,
          contractor.headline,
          contractor.city,
          ...contractor.serviceSlugs,
          ...contractor.trustSignals,
        ]
          .join(' ')
          .toLowerCase();

        const textMatch = tokens.every((token) =>
          searchableText.includes(token)
        );

        return (
          serviceMatch &&
          locationMatch &&
          ratingMatch &&
          budgetMatch &&
          textMatch
        );
      })
      .map((contractor) => ({
        contractor,
        score: scoreContractor(contractor, tokens),
      }));

    return scored
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.contractor);
  }, [
    contractors,
    query,
    serviceFilter,
    locationFilter,
    minRating,
    budgetFilter,
  ]);

  const comparedContractors = useMemo(() => {
    return compareIds
      .map((id) => contractors.find((contractor) => contractor.id === id))
      .filter((item): item is ContractorPreview => Boolean(item));
  }, [compareIds, contractors]);

  const toggleCompare = (contractorId: string) => {
    setCompareIds((previous) => {
      if (previous.includes(contractorId)) {
        return previous.filter((id) => id !== contractorId);
      }

      if (previous.length >= 3) {
        return previous;
      }

      return [...previous, contractorId];
    });
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 lg:grid-cols-5">
        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Search contractor
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Company, city, service, trust signal"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Service
          </span>
          <select
            value={serviceFilter}
            onChange={(event) => setServiceFilter(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
          >
            <option value="all">All services</option>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {formatServiceLabel(service)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Location
          </span>
          <input
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            placeholder="Bangkok"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Minimum rating
          </span>
          <select
            value={minRating}
            onChange={(event) => setMinRating(Number(event.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
          >
            <option value={4}>4.0+</option>
            <option value={4.5}>4.5+</option>
            <option value={4.8}>4.8+</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(budgetFilterLabels) as BudgetFilter[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setBudgetFilter(option)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              budgetFilter === option
                ? 'bg-cyan-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {budgetFilterLabels[option]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((contractor) => {
          const isCompared = compareIds.includes(contractor.id);

          return (
            <article
              key={contractor.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {contractor.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {contractor.headline}
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isCompared}
                    onChange={() => toggleCompare(contractor.id)}
                    disabled={!isCompared && compareIds.length >= 3}
                    className="h-3.5 w-3.5 rounded border-slate-300"
                  />
                  Compare
                </label>
              </div>

              <p className="mt-3 text-sm text-slate-700">
                {contractor.rating.toFixed(1)} rating ({contractor.reviews}{' '}
                reviews) - {contractor.city}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Budget:{' '}
                {formatBudgetRange(contractor.budgetMin, contractor.budgetMax)}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {contractor.yearsExperience} years experience -{' '}
                {contractor.successRate}% success rate - responds in{' '}
                {contractor.responseTimeHours}h
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {contractor.serviceSlugs.map((slug) => (
                  <span
                    key={slug}
                    className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-800"
                  >
                    {formatServiceLabel(slug)}
                  </span>
                ))}
                {contractor.verified && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                    Verified
                  </span>
                )}
              </div>

              <ul className="mt-4 space-y-1 text-xs text-slate-600">
                {contractor.trustSignals.map((signal) => (
                  <li key={signal}>- {signal}</li>
                ))}
              </ul>

              <div className="mt-4">
                <Link
                  href={`/contractors/${contractor.id}`}
                  className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
                >
                  Open profile
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          No contractors matched the selected filters. Try broadening location,
          budget, or rating.
        </p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Contractor comparison
            </h3>
            <p className="text-sm text-slate-600">
              Select up to three contractors to compare trust signals side by
              side.
            </p>
          </div>
          {compareIds.length > 0 && (
            <button
              type="button"
              onClick={() => setCompareIds([])}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Clear comparison
            </button>
          )}
        </div>

        {comparedContractors.length >= 2 ? (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2 pr-4 font-semibold">Trust signal</th>
                  {comparedContractors.map((contractor) => (
                    <th key={contractor.id} className="py-2 pr-6 font-semibold">
                      {contractor.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">Rating</td>
                  {comparedContractors.map((contractor) => (
                    <td key={contractor.id} className="py-2 pr-6">
                      {contractor.rating.toFixed(1)} ({contractor.reviews})
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">Experience</td>
                  {comparedContractors.map((contractor) => (
                    <td key={contractor.id} className="py-2 pr-6">
                      {contractor.yearsExperience} years
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">Success rate</td>
                  {comparedContractors.map((contractor) => (
                    <td key={contractor.id} className="py-2 pr-6">
                      {contractor.successRate}%
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">Response time</td>
                  {comparedContractors.map((contractor) => (
                    <td key={contractor.id} className="py-2 pr-6">
                      {contractor.responseTimeHours} hours
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">Budget fit</td>
                  {comparedContractors.map((contractor) => (
                    <td key={contractor.id} className="py-2 pr-6">
                      {formatBudgetRange(
                        contractor.budgetMin,
                        contractor.budgetMax
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Verification</td>
                  {comparedContractors.map((contractor) => (
                    <td key={contractor.id} className="py-2 pr-6">
                      {contractor.verified ? 'Verified' : 'Pending'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600">
            Select at least two contractors to open side-by-side comparison.
          </p>
        )}
      </section>
    </section>
  );
}
