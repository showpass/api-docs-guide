
import React from "react";

interface ParameterRow {
  parameter: string;
  type: string;
  status: string;
  description: string;
}

interface ParameterTableProps {
  data: ParameterRow[];
}

const ParameterTable: React.FC<ParameterTableProps> = ({ data }) => {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-3 text-left font-medium text-slate-700">Parameter</th>
            <th className="px-6 py-3 text-left font-medium text-slate-700">Type</th>
            <th className="px-6 py-3 text-left font-medium text-slate-700">Status</th>
            <th className="px-6 py-3 text-left font-medium text-slate-700">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-mono text-slate-700 font-medium">{row.parameter}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
                  {row.type}
                </span>
              </td>
              <td className="px-6 py-4">
                {row.status === "Required" ? (
                  <span className="font-medium text-slate-900">Required</span>
                ) : (
                  <span className="text-slate-500">Optional</span>
                )}
              </td>
              <td className="px-6 py-4 text-slate-700" 
                  dangerouslySetInnerHTML={{ __html: row.description.replace(/<br>/g, '<br />') }}>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParameterTable;
