// Template Only

<>
  {[1, 2, 3, 4, 5].map((index) => (
    <tr key={index}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="inline-block h-4 w-4 bg-gray-400/30 animate-pulse rounded"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="inline-block h-4 w-32 bg-gray-400/30 animate-pulse rounded"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="inline-block h-4 w-16 bg-gray-400/30 animate-pulse rounded"></div>
      </td>
    </tr>
  ))}
</>;
