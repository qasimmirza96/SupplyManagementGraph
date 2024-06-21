import { useState, useEffect, useMemo } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { onValue, ref } from "firebase/database";
import NeedleChart2 from "./NeedleChart2";
import NeedleChart4 from "./NeedleChart4";
import style from "./mainLayout.module.scss";
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
// importing firebass related modules
// import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../firebaseConfig";
import CsvDownload from "react-csv-downloader";
import CustomBarChart from "./CustomBarChart";
import CustomLineChart from "./CustomLineChart";
import FilterComponent from "./FilterComponent";
import { loadStripe } from "@stripe/stripe-js";

// genetrating random data with generateRandomData.
function generateRandomData() {
  return {
    value1: {
      value: Math.floor(Math.random() * 100),
      unit: "A", //amphere
    },
    value2: {
      value: Math.floor(Math.random() * 100),
      unit: "W", //watt
    },
    value3: {
      value: Math.floor(Math.random() * 100),
      unit: "Volt", //volt
    },
    value4: {
      value: Math.floor(Math.random() * 100),
      unit: "Hz", //hertzz
    },
  };
}
function useResponsiveFontSize() {
  const getFontSize = () => (window.innerWidth < 450 ? "16px" : "18px");
  const [fontSize, setFontSize] = useState(getFontSize);

  useEffect(() => {
    const onResize = () => {
      setFontSize(getFontSize());
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  return fontSize;
}
function useOptions () {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
         
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#9e2146"
        }
      }
    }),
    [fontSize]
  );

  return options;
};
function MainLayout() {
  // state of the component
  const [isListVisible, setListVisibility] = useState(false);
  const [isListVisible2, setListVisibility2] = useState(false);
  const [isListVisible3, setListVisibility3] = useState(false);
  const [isListVisible4, setListVisibility4] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
 


  

  const [history, setHistory] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState("Last week");

  const [history2, setHistory2] = useState(false);
  const [selectedHistory2, setSelectedHistory2] = useState("Upcoming week");

  const [data, setData] = useState(generateRandomData());
  const [cities, setCities] = useState([]);
  const [selectedOption, setSelectedOption] = useState("All");
  const [selectedOption2, setSelectedOption2] = useState("All");
  // const [lineChartData, setLineChartData] = useState([]);

  const [lineChartData, setLineChartData] = useState([
    {
      name: "Monday",
      pv: 5003,
      curr: 3900,
      vol: 7000,
      freq: 6400,
      pow: 10000,
    },
    {
      name: "Tuesday",

      curr: 2900,
      vol: 7000,
      freq: 9998,
      pow: 2210,
    },
    {
      name: "Wednesday",

      curr: 4900,
      vol: 5000,
      freq: 9800,
      pow: 4290,
    },
    {
      name: "Thursday",

      curr: 5900,
      vol: 8980,
      freq: 7908,
      pow: 2000,
    },
    {
      name: "Friday",

      curr: 1900,
      vol: 9890,
      freq: 2800,
      pow: 2181,
    },
    {
      name: "Saturday",

      curr: 6900,
      vol: 5390,
      freq: 9800,
      pow: 3500,
    },
    {
      name: "Sunday",
      curr: 3900,
      vol: 8980,
      freq: 6908,
      pow: 2000,
    },
  ]);
  const [lineChartData2, setLineChartData2] = useState([
    {
      name: "Monday",
      pv: 5003,
      curr: 3900,
      vol: 7000,
      freq: 6400,
      pow: 10000,
    },
    {
      name: "Tuesday",

      curr: 2900,
      vol: 7000,
      freq: 9998,
      pow: 2210,
    },
    {
      name: "Wednesday",

      curr: 4900,
      vol: 5000,
      freq: 9800,
      pow: 4290,
    },
    {
      name: "Thursday",

      curr: 5900,
      vol: 8980,
      freq: 7908,
      pow: 2000,
    },
    {
      name: "Friday",

      curr: 1900,
      vol: 9890,
      freq: 2800,
      pow: 2181,
    },
    {
      name: "Saturday",

      curr: 6900,
      vol: 5390,
      freq: 9800,
      pow: 3500,
    },
    {
      name: "Sunday",
      curr: 3900,
      vol: 8980,
      freq: 6908,
      pow: 2000,
    },
  ]);

  const handleHistorySelect = (option) => {
    setSelectedHistory(option);
    setHistory(false);

    // Logic to generate new lineChartData based on the selected history
    let newData = [];
    switch (option) {
      case "Last week":
        newData = generateChartDataForDays(7);
        break;
      case "Last month":
        newData = generateChartDataForWeeks(4); // 4 weeks in a month
        break;
      case "Last year":
        newData = generateChartDataForMonths(12);
        break;
      default:
        newData = lineChartData;
        break;
    }

    setLineChartData(newData);
  };


  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const handleSubmit = async event => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    });

    console.log("[PaymentMethod]", payload);
   if(payload?.paymentMethod){ setIsModalOpen(false)
    alert('Your bill pay sucessfully!!')}
  };


  const handleHistorySelect2 = (option) => {
    setSelectedHistory2(option);
    setHistory2(false);

    // Logic to generate new lineChartData based on the selected history
    let newData = [];
    switch (option) {
      case "Upcoming week":
        newData = generateChartDataForDays(7);
        break;
      case "Upcoming month":
        newData = generateChartDataForWeeks(4); // 4 weeks in a month
        break;
      case "Upcoming year":
        newData = generateChartDataForMonths(12);
        break;
      default:
        newData = lineChartData2;
        break;
    }

    setLineChartData2(newData);
  };

  // Function to generate chart data for a given number of days
  const generateChartDataForDays = (numDays) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const newData = Array.from({ length: numDays }, (_, index) => {
      const dayIndex = (today.getDay() + 6 - index) % 7; // Calculate the day index based on today
      return {
        curr: Math.floor(Math.random() * 10000),
        vol: Math.floor(Math.random() * 10000),
        freq: Math.floor(Math.random() * 5000),
        pow: Math.floor(Math.random() * 5000),
        name: days[dayIndex],
      };
    });
    return newData.reverse(); // Reverse the array to have data in chronological order
  };

  // Function to generate chart data for a given number of weeks (assuming 4 weeks in a month)
  const generateChartDataForWeeks = (numWeeks) => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const newData = Array.from({ length: numWeeks }, (_, index) => ({
      curr: Math.floor(Math.random() * 10000),
      pv: Math.floor(Math.random() * 10000),
      vol: Math.floor(Math.random() * 10000),
      frq: Math.floor(Math.random() * 5000),
      pow: Math.floor(Math.random() * 5000),
      name: weeks[index],
    }));
    return newData;
  };

  // Function to generate chart data for a given number of months
  const generateChartDataForMonths = () => {
    const months = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const newData = months.map((month) => ({
      curr: Math.floor(Math.random() * 10000),
      vol: Math.floor(Math.random() * 10000),
      freq: Math.floor(Math.random() * 5000),
      pow: Math.floor(Math.random() * 5000),
      name: month,
    }));
    return newData;
  };

  const toggleListVisibility = () => {
    setListVisibility(!isListVisible);
    setListVisibility2(false); // Close the first rectangle when the first one is clicked
  };
  const toggleListVisibility2 = () => {
    setListVisibility2(!isListVisible2);
    setListVisibility(false); // Close the second rectangle when the first one is clicked
  };


  const toggleListVisibility3 = () => {
    setListVisibility3(!isListVisible3);
    setListVisibility4(false); // Close the first rectangle when the first one is clicked
  };
  const toggleListVisibility4 = () => {
    setListVisibility4(!isListVisible4);
    setListVisibility3(false); // Close the second rectangle when the first one is clicked
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setListVisibility(false);
  };

  const handleOptionSelect2 = (option) => {
    setSelectedOption2(option);
    setListVisibility3(false);
  };

  useEffect(() => {
    setData(generateRandomData());
  }, [selectedOption, selectedHistory]);

  // Database related code presents here
  async function getCities() {
    try {
      const citiesRef = ref(db, "dev1gf");

      // Use a Promise to wait for the callback to be invoked
      return new Promise((resolve, reject) => {
        onValue(
          citiesRef,
          (snapshot) => {
            const cityList = snapshot.val();

            resolve(cityList);
          },
          (error) => {
            reject(error);
          }
        );
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  // Use case the async function
  (async () => {
    try {
      const cities = await getCities();
      // console.log("data:", cities);
    } catch (error) {
      console.error("Error:", error);
    }
  })();
  
  useEffect(() => {
    getCities()
      .then((data) => setCities(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const citiesToDownload = [];
  Object.entries(cities).forEach(([key, value]) => {
    console.log(key, value);

    const temp = {
      Enviornment_Humidity: value?.Enviornment?.Humidity,
      Enviornment_Temperature: value?.Enviornment?.Temperature,
      Sensor1_Energy: value?.Sensor1?.Energy,
      Sensor1_Power: value?.Sensor1?.Power,
      Sensor1_PowerFactor: value?.Sensor1?.PowerFactor,
      Sensor2_Energy: value?.Sensor2?.Energy,
      Sensor2_Power: value?.Sensor2?.Power,
      Sensor2_PowerFactor: value?.Sensor2?.PowerFactor,
      Sensor3_Energy: value?.Sensor3?.Energy,
      Sensor3_Power: value?.Sensor3?.Power,
      Sensor3_PowerFactor: value?.Sensor3?.PowerFactor,
    };

    citiesToDownload.push(temp);
  });

  console.log(citiesToDownload, "cities to donload");

  const columns = [
    {
      id: "Enviornment_Humidity",
      displayName: "Humidity",
    },
    {
      id: "Enviornment_Temperature",
      displayName: "Temperature",
    },
    // {
    //   id: 'Sensor1_Current',
    //   displayName: 'Sensor1 Current',
    // },
    {
      id: "Sensor1_Energy",
      displayName: "Sensor1 Energy",
    },
    // {
    //   id: 'Sensor1_Frequency',
    //   displayName: 'Sensor1 Frequency',
    // },
    {
      id: "Sensor1_Power",
      displayName: "Sensor1 Power",
    },
    {
      id: "Sensor1_PowerFactor",
      displayName: "Sensor1 PowerFactor",
    },
    // {
    //   id: 'Sensor1_Voltage',
    //   displayName: 'Sensor1 Voltage',
    // },
    // {
    //   id: 'Sensor2_Current',
    //   displayName: 'Sensor2 Current',
    // },
    {
      id: "Sensor2_Energy",
      displayName: "Sensor2 Energy",
    },
    // {
    //   id: 'Sensor2_Frequency',
    //   displayName: 'Sensor2 Frequency',
    // },
    {
      id: "Sensor2_Power",
      displayName: "Sensor2 Power",
    },
    {
      id: "Sensor2_PowerFactor",
      displayName: "Sensor2 PowerFactor",
    },
    // {
    //   id: 'Sensor2_Voltage',
    //   displayName: 'Sensor2 Voltage',
    // },
    // {
    //   id: 'Sensor3_Current',
    //   displayName: 'Sensor3 Current',
    // },
    {
      id: "Sensor3_Energy",
      displayName: "Sensor3 Energy",
    },
    // {
    //   id: 'Sensor3_Frequency',
    //   displayName: 'Sensor3 Frequency',
    // },
    {
      id: "Sensor3_Power",
      displayName: "Sensor3 Power",
    },
    {
      id: "Sensor3_PowerFactor",
      displayName: "Sensor3 PowerFactor",
    },
    // {
    //   id: 'Sensor3_Voltage',
    //   displayName: 'Sensor3 Voltage',
    // },
  ];

  return (
    <>
      <div className={style.mainLayout}>
        <div className={style.layout}>
          <div className={style.left}>
            <div className={style.subLeft}>
              <div className="flex al a jc">
                {cities &&
                  Object.entries(cities).map(([key, value], index) => {
                    if (index === 0) {
                      // Process only the first object
                      return (
                        <div key={key} className={style.box}>
                          Current
                          <div className="d-flex al-c jc-sp">
                            <div>A</div>
                            <div>B</div>
                            <div>C</div>
                          </div>
                          <div className="d-flex al-c jc-sp">
                            <div>{value?.Sensor1?.Current}</div>
                            <div>{value?.Sensor2?.Current}</div>
                            <div>{value?.Sensor3?.Current}</div>
                          </div>
                        </div>
                      );
                    } else {
                      // Return null for the subsequent objects
                      return null;
                    }
                  })}
                {/* Power */}
                {cities &&
                  Object.entries(cities).map(([key, value], index) => {
                    if (index === 0) {
                      // Process only the first object
                      return (
                        <div key={key} className={style.box}>
                          Power
                          <div className="d-flex al-c jc-sp">
                            <div>A</div>
                            <div>B</div>
                            <div>C</div>
                          </div>
                          <div className="d-flex al-c jc-sp">
                            <div>{value?.Sensor1?.Power}</div>
                            <div>{value?.Sensor2?.Power}</div>
                            <div>{value?.Sensor3?.Power}</div>
                          </div>
                        </div>
                      );
                    } else {
                      // Return null for the subsequent objects
                      return null;
                    }
                  })}
              </div>

              <div className="flex al  jc">
                {cities &&
                  Object.entries(cities).map(([key, value], index) => {
                    if (index === 1) {
                      // Process only the first object
                      return (
                        <div key={key} className={style.box}>
                          Voltage
                          <div className="d-flex al-c jc-sp ">
                            <div>A</div>
                            <div>B</div>
                            <div>C</div>
                          </div>
                          <div className="d-flex al-c jc-sp">
                            <div>{value?.Sensor1?.Voltage}</div>
                            <div>{value?.Sensor2?.Voltage}</div>
                            <div>{value?.Sensor3?.Voltage}</div>
                          </div>
                        </div>
                      );
                    } else {
                      // Return null for the subsequent objects
                      return null;
                    }
                  })}
                {cities &&
                  Object.entries(cities).map(([key, value], index) => {
                    if (index === 0) {
                      // Process only the first object
                      return (
                        <div key={key} className={`${style.box} margin `}>
                          Frequency
                          <div className="d-flex al-c jc-sp">
                            <div>A</div>
                            <div>B</div>
                            <div>C</div>
                          </div>
                          <div className="d-flex al-c jc-sp">
                            <div>{value?.Sensor1?.Frequency}</div>
                            <div>{value?.Sensor2?.Frequency}</div>
                            <div>{value?.Sensor3?.Frequency}</div>
                          </div>
                        </div>
                      );
                    } else {
                      // Return null for the subsequent objects
                      return null;
                    }
                  })}
              </div>
              <div className={style.bigBoxWrapper}>
                <div className="flexx al  jc">
                  <div className={style.rectangle}>
                    <div className={style.innerRect}>
                      {selectedOption}

                      <ul
                        style={{
                          display: isListVisible ? "block" : "none",
                        }}
                      >
                        <li onClick={() => handleOptionSelect("All")}>All</li>
                        <li onClick={() => handleOptionSelect("Current")}>
                          Current
                        </li>
                        <li onClick={() => handleOptionSelect("Voltage")}>
                          Voltage
                        </li>
                        <li onClick={() => handleOptionSelect("Frequency")}>
                          Frequency
                        </li>
                        <li onClick={() => handleOptionSelect("Power")}>
                          Power
                        </li>
                      </ul>
                      <span>
                        {" "}
                        <IoIosArrowDropdown
                          onClick={toggleListVisibility}
                        />{" "}
                      </span>
                    </div>
                  </div>
                  <div className={style.rectangle}>
                    <div className={style.innerRect}>
                      {selectedHistory}
                      <ul
                        style={{
                          display: isListVisible2 ? "block" : "none",
                        }}
                      >
                        <li onClick={() => handleHistorySelect("Last week")}>
                          Last week
                        </li>
                        <li onClick={() => handleHistorySelect("Last month")}>
                          Last month
                        </li>
                        <li onClick={() => handleHistorySelect("Last year")}>
                          Last year
                        </li>
                      </ul>
                      <span>
                        <IoIosArrowDropdown onClick={toggleListVisibility2} />
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={style.bigBox}
                  style={{
                    position: "relative",
                    top: isListVisible ? "24vh" : isListVisible2 ? "15vh" : 0,
                  }}
                >
                  <h3>Min&max values chart</h3>
                  <CustomLineChart
                    lineChatData={lineChartData}
                    selectedOption={selectedOption}
                  />

                  <div className={style.innerBigBox}>
                    <div className={style.vlaues}>
                      {cities &&
                        Object.entries(cities).map(([key, value], index) => {
                          if (index === 0) {
                            return (
                              <table style={{ width: "100%" }}>
                                <tr>
                                  <th>Values</th>
                                  <th>Min</th>
                                  <th>Max</th>
                                </tr>
                                <tr>
                                  <td>Current</td>
                                  <td>{value?.Sensor1?.Current}</td>
                                  <td>{value?.Sensor3?.Current}</td>
                                </tr>
                                <tr>
                                  <td>Power</td>
                                  <td>{value?.Sensor1?.Power}</td>
                                  <td>{value?.Sensor3?.Power}</td>
                                </tr>
                                <tr>
                                  <td>Voltage</td>
                                  <td>{value?.Sensor2?.Voltage}</td>
                                  <td>{value?.Sensor3?.Voltage}</td>
                                </tr>
                                <tr>
                                  <td>Frequency</td>
                                  <td>{value?.Sensor1?.Frequency}</td>
                                  <td>{value?.Sensor3?.Frequency}</td>
                                </tr>
                              </table>
                            );
                          }
                        })}
                    </div>
                    
                  </div>
                  
                </div>
               
              </div>
              <div className={style.bigBoxWrapper}>
                <div className="flexx al  jc">
                  <div className={style.rectangle}>
                    <div className={style.innerRect}>
                      {selectedOption2}

                      <ul
                        style={{
                          display: isListVisible3 ? "block" : "none",
                        }}
                      >
                        <li onClick={() => handleOptionSelect2("All")}>All</li>
                        <li onClick={() => handleOptionSelect2("Current")}>
                          Current
                        </li>
                        <li onClick={() => handleOptionSelect2("Voltage")}>
                          Voltage
                        </li>
                        <li onClick={() => handleOptionSelect2("Frequency")}>
                          Frequency
                        </li>
                        <li onClick={() => handleOptionSelect2("Power")}>
                          Power
                        </li>
                      </ul>
                      <span>
                        {" "}
                        <IoIosArrowDropdown
                          onClick={toggleListVisibility3}
                        />{" "}
                      </span>
                    </div>
                  </div>
                  <div className={style.rectangle}>
                    <div className={style.innerRect}>
                      {selectedHistory2}
                      <ul
                        style={{
                          display: isListVisible4 ? "block" : "none",
                        }}
                      >
                        <li onClick={() => handleHistorySelect2("Upcoming week")}>
                          Upcoming week
                        </li>
                        <li onClick={() => handleHistorySelect2("Upcoming month")}>
                        Upcoming month
                        </li>
                      
                      </ul>
                      <span>
                        <IoIosArrowDropdown onClick={toggleListVisibility4} />
                      </span>
                    </div>
                  </div>
                </div>

            
                <div
                  className={style.bigBox}
                  style={{
                    position: "relative",
                    top: isListVisible3 ? "24vh" : isListVisible4 ? "15vh" : 0,
                  }}
                >
                  <h3>Prediction chart</h3>
                  <CustomLineChart
                    lineChatData={lineChartData2}
                    selectedOption={selectedOption2}
                  />

                  <div className={style.innerBigBox}>
                    <div className={style.vlaues}>
                      {cities &&
                        Object.entries(cities).map(([key, value], index) => {
                          if (index === 0) {
                            return (
                              <table style={{ width: "100%" }}>
                                <tr>
                                  <th>Values</th>
                                  <th>Min</th>
                                  <th>Max</th>
                                </tr>
                                <tr>
                                  <td>Current</td>
                                  <td>{value?.Sensor1?.Current}</td>
                                  <td>{value?.Sensor3?.Current}</td>
                                </tr>
                                <tr>
                                  <td>Power</td>
                                  <td>{value?.Sensor1?.Power}</td>
                                  <td>{value?.Sensor3?.Power}</td>
                                </tr>
                                <tr>
                                  <td>Voltage</td>
                                  <td>{value?.Sensor2?.Voltage}</td>
                                  <td>{value?.Sensor3?.Voltage}</td>
                                </tr>
                                <tr>
                                  <td>Frequency</td>
                                  <td>{value?.Sensor1?.Frequency}</td>
                                  <td>{value?.Sensor3?.Frequency}</td>
                                </tr>
                              </table>
                            );
                          }
                        })}
                    </div>
                    
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

          <div className={style.right}>
            <div className={style.innerRight}>
           
                <button className="downloadData" onClick={()=>setIsModalOpen(true)} style={{height:50}}>Pay bill</button>
            
              <div className="downloadData">
                <CsvDownload
                  text="Download"
                  datas={citiesToDownload}
                  columns={columns}
                  filename="myfile"
                  extension=".csv"
                />
              </div>

            


              <div className={`${style.box} smBox `}>
                <form className={style.form}>
                  <label>
                    {" "}
                    Currently Units
                    <div className={style.innerBigBox}>
                      <div className={style.rectBox}>{data.value2.value}</div>
                      <div className={style.rectBox}>{data.value2.value}</div>
                      <div className={style.rectBox}>{data.value3.value}</div>
                      <div className={style.rectBox}>{data.value4.value}</div>
                    </div>
                  </label>
                </form>
              </div>
              <div className={style.box}>
                <b>Humindity</b>
                <NeedleChart2 item={cities} />
              </div>
              <div className={style.box}>
                <b>Temprature</b>
                <NeedleChart4 />
              </div>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="modal">
             
             <form style={{width:'85%'}} onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement
          options={options}
          onReady={() => {
            console.log("CardElement [ready]");
          }}
          onChange={event => {
            console.log("CardElement [change]", event);
          }}
          onBlur={() => {
            console.log("CardElement [blur]");
          }}
          onFocus={() => {
            console.log("CardElement [focus]");
          }}
        />
      </label>
      <button type="submit" className="downloadData" style={{width:'78%',height:50}} disabled={!stripe}>
        Pay
      </button>
    </form>
  
          </div>
        )}
      </div>
    </>
  );
}

export default MainLayout;
