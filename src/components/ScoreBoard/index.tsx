export const ScoreBoard = ({ score }) => {
  return (
    <div className="flex justify-around min-h-screen items-center px-4">
      <div className="bg-gray-100 rounded-xl max-w-[450px] py-8 px-6 mx-auto w-full">
        <table className="w-full">
          <tr>
            <th className="text-left text-xl uppercase">Contestant</th>
            <th className="text-center text-xl uppercase">Score</th>
          </tr>
          {Object.entries(score).map(([contestant, score]) => (
            <tr key={contestant}>
              <td>Contestant {contestant}</td>
              <td className="text-center py-2">{score}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};
