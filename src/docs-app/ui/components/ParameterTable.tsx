
import React from "react";
import { ParameterRow } from "@/docs-app/data/types";

interface ParameterTableProps {
  data: ParameterRow[];
}

const ParameterTable: React.FC<ParameterTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm my-6">
      <table className="w-full text-sm table-auto">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-left font-medium text-slate-700 whitespace-nowrap">Parameter</th>
            <th className="px-4 py-3 text-left font-medium text-slate-700 whitespace-nowrap">Type</th>
            <th className="px-4 py-3 text-left font-medium text-slate-700 whitespace-nowrap">Status</th>
            <th className="px-4 py-3 text-left font-medium text-slate-700">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4 font-mono text-slate-700 font-medium whitespace-nowrap">{row.parameter}</td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
                  {row.type}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                {row.status === "Required" ? (
                  <span className="font-medium text-slate-900">Required</span>
                ) : (
                  <span className="text-slate-500">Optional</span>
                )}
              </td>
              <td className="px-4 py-4 text-slate-700 break-words">
                <div
                  dangerouslySetInnerHTML={{
                    __html: row.description.replace(/<br>/g, "<br />"),
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParameterTable;
