
export interface ParameterRow {
  parameter: string;
  type: string;
  status: string;
  description: string;
}

export function parseParameterTable(content: string): ParameterRow[] {
  // Find content between PARAMETER_TABLE_START and PARAMETER_TABLE_END
  const tableRegex = /<!-- PARAMETER_TABLE_START -->([\s\S]*?)<!-- PARAMETER_TABLE_END -->/g;
  const tableMatches = [...content.matchAll(tableRegex)];
  
  if (!tableMatches || tableMatches.length === 0) return [];
  
  // Get the first table content and split into lines
  const tableContent = tableMatches[0][1].trim();
  const lines = tableContent.split('\n').filter(line => line.trim() !== '');
  
  // Remove header and separator lines (first two lines)
  const dataLines = lines.slice(2);
  
  // Parse each line into a parameter row
  return dataLines.map(line => {
    const cells = line.split('|').map(cell => cell.trim()).filter(Boolean);
    
    if (cells.length >= 4) {
      return {
        parameter: cells[0],
        type: cells[1],
        status: cells[2],
        description: cells[3]
      };
    }
    
    // Fallback for malformed rows
    return {
      parameter: cells[0] || '',
      type: cells[1] || '',
      status: cells[2] || '',
      description: cells[3] || ''
    };
  });
}
