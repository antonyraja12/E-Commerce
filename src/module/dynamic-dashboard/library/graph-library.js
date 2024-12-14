import Chart from "react-apexcharts";
export function GraphLibrary(props) {
  return (
    <>
      <Chart {...props} width={"100%"} style={{ width: "100%" }} />
    </>
  );
}
