export const parseCsv = (csv) => {
  const lines = csv.trim().split('\n');
  const headers = parseLine(lines[0]);

  return lines.slice(1).map(line => {
    const values = parseLine(line);
    const obj = {};

    headers.forEach((header, i) => {
      obj[header] = values[i] ?? '';
    });

    return obj;
  });
};

const parseLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
};

export const FoodTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <pre style={{
      textAlign: 'left',
      // width: 400,
      overflow: 'hidden',
    }}>
      { JSON.stringify(data, null, 2) }
    </pre>
  );

  return (
    <table style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headers.map(header => (
            <th
              key={header}
              style={{
                padding: '6px 10px',
                fontWeight: 'bold',
                textAlign: 'left',
                borderBottom: '1px solid #ddd'
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {headers.map(header => (
              <td
                key={header}
                style={{
                  padding: '6px 10px',
                  borderBottom: '1px solid #eee'
                }}
              >
                {row[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FoodTable;
