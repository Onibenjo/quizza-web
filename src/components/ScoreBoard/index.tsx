import classNames from "classnames";
import { FaCrown } from "react-icons/fa";

const sizes = {
  0: "text-2xl text-green-600",
  1: "text-[22px]",
  2: "text-xl",
  3: "text-xl",
};

export const ScoreBoard = ({
  score,
}: {
  score: {
    1: number;
    2: number;
    3: number;
    4: number;
  };
}) => {
  const scores = Object.entries(score).sort(
    ([, a], [, b]) => Number(b) - Number(a)
  );
  const lowestScore = Math.min(...scores.map(([, sc]) => sc));

  return (
    <div className="flex justify-around min-h-screen items-center px-4">
      <div className="bg-gray-100 rounded-xl max-w-[450px] py-8 px-6 mx-auto w-full">
        <table className="w-full text-xl">
          <thead>
            <tr>
              <th className="text-left text-2xl uppercase">Contestant</th>
              <th className="text-center text-2xl uppercase">Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map(([contestant, score], idx) => (
              <tr key={contestant}>
                <td
                  className={classNames(
                    sizes[idx],
                    lowestScore === score && "text-red-600"
                  )}
                >
                  <div className="flex">
                    {idx === 0 && (
                      <span className="inline-block mr-2">
                        <FaCrown />
                      </span>
                    )}
                    <div>Contestant {contestant}</div>
                  </div>
                </td>
                <td className="text-center py-2">{score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
