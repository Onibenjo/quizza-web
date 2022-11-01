function BottomScoreboard({ score }) {
  return (
    <div className="w-full absolute px-2 py-3 bg-white bottom-0 grid grid-cols-2 items-center">
      <div className="text-2xl font-bold">Scoreboard:</div>
      <div className="grid grid-cols-2 text-xl">
        <p className="">
          Device 1 {"=>"} {score["1"]}
        </p>
        <p className="">
          Device 2 {"=>"} {score["2"]}
        </p>
        <p className="">
          Device 3 {"=>"} {score["3"]}
        </p>
        <p className="">
          Device 4 {"=>"} {score["4"]}
        </p>
      </div>
    </div>
  );
}

export default BottomScoreboard;
