import React, { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js/dist/html2pdf.min';
import './App.css'
import BarChart from "./components/BarChart.js";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

Chart.register(CategoryScale);
function collect_aims() {
  let aims = [];

  document.querySelectorAll(".aim-checkbox").forEach((item) => {
      if (item.checked) {
          aims.push(item.value)
      }
  });

  let additional_info = document.querySelector("#aim-addons").value.trim();
  if (additional_info !== "") 
    aims.push(additional_info);

  return aims;
}

function collect_tasks() {
  let tasks = [];

  document.querySelectorAll(".task-checkbox").forEach((item) => {
      if (item.checked) {
          tasks.push(item.value)
      }
  });

  let additional_info = document.querySelector("#task-addons").value.trim();
  if (additional_info !== "") 
    tasks.push(additional_info);

  return tasks;
}


function collect_sources() {
  let sources = [];

  document.querySelectorAll(".source-checkbox").forEach((item) => {
      if (item.checked) {
          sources.push(item.value)
      }
  });

  return sources;
}


function App() {
  const [startToggler, setStartToggler] = useState(true);
  const [sphere, setSphere] = useState('');
  const [theme, setTheme] = useState('');
  const [aimResponseData, setAimsResponseData] = useState(null); 
  const [tasksResponseData, setTasksResponseData] = useState(null); 
  const [planResponseData, setPlanResponseData] = useState(null); 
  const [sourcesResponseData, setSourcesResponseData] = useState(null); 
  const [reportResponseData, setReportResponseData] = useState(null); 
  const [chartData, setChartData] = useState({
    labels: ['Аэродинамика полета', 'Анатомия лошади', 'Временные ряды', 'Система рекомендации фильмов', 'Квантовая физика', 'Ваш проект'],
    datasets: [{
        data: [12, 9, 5, 7, 12, 8],
        label: '# сложность',
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }]
  }); 

  const handleStartForm = async (event) => {
    event.preventDefault();

    try {
      const aimFormInfo = {
        "sphere": sphere,
        "theme": theme
      };

      const response = await axios({
        method: "post",
        url: 'http://95.163.228.81:8000/report/aims', 
        data: JSON.stringify(aimFormInfo),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      setAimsResponseData(response.data); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleAimForm = async (event) => {
    event.preventDefault();

    const aims = collect_aims();

    const taskFormInfo = {
      "aims": aims,
      "sphere": sphere,
      "theme": theme
    };

    try {
      const response = await axios({
        method: "post",
        url: 'http://95.163.228.81:8000/report/tasks', 
        data: JSON.stringify(taskFormInfo),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      setTasksResponseData(response.data); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskForm = async (event) => {
    event.preventDefault();

    const tasks = collect_tasks();

    const planFormInfo = {
      "tasks": tasks
    };

    try {
      const response = await axios({
        method: "post",
        url: 'http://95.163.228.81:8000/report/plan', 
        data: JSON.stringify(planFormInfo),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      setPlanResponseData(response.data); 
    } catch (error) {
      console.error(error);
    }
  };

    
  const handlePlanForm = async (event) => {
    event.preventDefault();

    try {
      const sourceFormInfo = {
        "theme": theme
      };

      const response = await axios({
        method: "post",
        url: 'http://95.163.228.81:8000/report/sources', 
        data: JSON.stringify(sourceFormInfo),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      setSourcesResponseData(response.data); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleSourcesForm = async (event) => {
    event.preventDefault();

    const aims = collect_aims();
    const tasks = collect_tasks();
    const sources = collect_sources();

    const reportFormInfo = {
      "aims": aims,
      "sphere": sphere,
      "theme": theme,
      "tasks": tasks,
      "sources": sources,
      "plan": document.querySelector("#plan").value
    };

    try {
      const response = await axios({
        method: "post",
        url: 'http://95.163.228.81:8000/report/generate', 
        data: JSON.stringify(reportFormInfo),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      setReportResponseData(response.data); 
      setAimsResponseData(false);
      setPlanResponseData(false);
      setTheme(false);
      setSphere(false);
      setTasksResponseData(false);
      setSourcesResponseData(false);
      setStartToggler(false);
      setChartData({
        labels: ['Аэродинамика полета', 'Анатомия лошади', 'Временные ряды', 'Система рекомендации фильмов', 'Квантовая физика', 'Ваш проект'],
        datasets: [{
            data: [12, 9, 5, 7, 12, response.data.report.complexity],
            label: '# сложность',
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
      });
    } catch (error) {
      console.error(error);
    }
  };

  const printDoc = (event) => {
    event.preventDefault();
    window.print();
  };

  const toPdf = (event) => {
    event.preventDefault();
    let rootElem = document.querySelector('#pdf-root');
    let opt = {
      jsPDF:  { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
     
    html2pdf().from(rootElem).set(opt).save('Прототип научной статьи (LazyLearn Ai).pdf');
  };

  

  return (
    <div className="App" id="pdf-root">
      {reportResponseData && (
        <div id="article" className='flex-col-wrapper'>
          <div id="article-head" className='form-wrapper'>
             <h2>{reportResponseData.report.title}</h2>
             <div className="divider"></div>
             <p>время на чтение {reportResponseData.report.time} минут</p>
          </div>
          <div className='form-wrapper'>
             <h2>Актуальность</h2>
             <div className="divider"></div>
             <div className='text-wrapper'>
                 <p>{reportResponseData.report.relevance}</p>
              </div>
          </div>
          <div className='form-wrapper'>
             <h2>Цели</h2>
             <div className="divider"></div>
             <div className='text-wrapper'>
                  {reportResponseData.report.aims.map((item, index) => (
                    <p><b>{index+1}.</b> {item}</p>
                  ))}
              </div>
          </div>
          <div className='form-wrapper'>
             <h2>Задачи</h2>
             <div className="divider"></div>
             <div className='text-wrapper'>
                  {reportResponseData.report.tasks.map((item, index) => (
                    <p><b>{index+1}.</b> {item}</p>
                  ))}
              </div>
          </div>
          <div className='form-wrapper'>
             <h2>План</h2>
             <div className="divider"></div>
             <div className='text-wrapper'>
                 <p>{reportResponseData.report.plan}</p>
                 <br/>
                 <b>рекомендации:</b>
                 <p>{reportResponseData.report.recomendations}</p>
              </div>
          </div>
          <div className='form-wrapper'>
             <h2>Справочный материал</h2>
             <div className="divider"></div>
             <div className='text-wrapper'>
                 <p>{reportResponseData.report.material}</p>
              </div>
          </div>
          <div className='form-wrapper'>
             <h2>Аналитика</h2>
             <div className="divider"></div>
             <div className='text-wrapper'>
                  { chartData &&
                       <BarChart chartData={chartData} />
                    }
              </div>
          </div>
          <div className='form-wrapper'>
             <h2>Источники</h2>
             <div className="divider"></div>
             <div className='text-wrapper'>
                  {reportResponseData.report.sources.map((item, index) => (
                    <p><b>{index+1}.</b><a href={item}>{item}</a></p>
                  ))}
              </div>
          </div>
          <div id="option-bar">
              <div onClick={toPdf}>Экспорт в PDF</div>
              <span>|</span>
              <div onClick={printDoc}>Печать</div>
          </div>
        </div>
      )}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      {startToggler && (
              <>
                <div id="menu-bar">
                <div className="menu-link-wrapper">
                  <a href="#aims-part">Цели</a>
                  <a href="#tasks-part">Задачи</a>
                  <a href="#plan-part">План</a>
                  <a href="#sources-part">Источники</a>
                </div>
              </div>
              <div className='form-wrapper start'>
                <h2>LAZYLEARN AI AGENT</h2>
                <div className='divider'></div>
                <form onSubmit={handleStartForm}>
                  <div className='form-field-row'>
                    <label htmlFor="sphere">Сфера:</label>
                    <input
                      type="text"
                      id="sphere"
                      value={sphere}
                      onChange={(e) => setSphere(e.target.value)}
                    />
                  </div>
                  <div className='form-field-row'>
                    <label htmlFor="theme">Тема:</label>
                    <input
                      type="text"
                      id="theme"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                    />
                  </div>
                  <button type="submit">Начать</button>
                </form>
              </div>
            </>
      )}
      {aimResponseData && (
        <div id="aims-part" className="form-wrapper">
          <h2>Цели</h2>
          <div className='divider'></div>
            <form onSubmit={handleAimForm}>
              {aimResponseData.aims.map((item, index) => (
                <div key={index}>
                  <input className='aim-checkbox' value={item} type="checkbox" />
                  <label>{item}</label>
                </div>
              ))}
              <input type="text" placeholder="Ваши примечания" id="aim-addons"></input>
              <button type="submit">Далее</button>
           </form>
        </div>
      )}
      {tasksResponseData && (
        <div id="tasks-part" className="form-wrapper">
          <h2>Задачи</h2>
          <div className='divider'></div>
            <form onSubmit={handleTaskForm}>
              {tasksResponseData.tasks.map((item, index) => (
                <div key={index}>
                  <input className='task-checkbox' value={item} type="checkbox" />
                  <label>{item}</label>
                </div>
              ))}
              <input type="text" placeholder="Ваши примечания" id="task-addons"></input>
              <button type="submit">Далее</button>
           </form>
        </div>
      )}
      {planResponseData && (
        <div id="plan-part" className='form-wrapper'>
          <h2>План</h2>
          <div className='divider'></div>
          <form onSubmit={handlePlanForm}>
              <textarea id="plan">{planResponseData.plan}</textarea>
              <button type="submit">Далее</button>
           </form>
        </div>
      )}
      {sourcesResponseData && (
        <div id="sources-part" className='form-wrapper'>
          <h2>Источники</h2>
          <div className='divider'></div>
          <form onSubmit={handleSourcesForm}>
              {sourcesResponseData.sources.map((item, index) => (
                <div key={index} className='source-wrapper'>
                      <input className='source-checkbox' value={item[1]} type="checkbox" />
                      <div>
                          <a href={item[1]} rel="noreferrer" target="_blank">{item[1]}</a>
                          <p>{item[0]}</p>
                      </div>
                </div>
              ))}
              <button type="submit">Сгенерировать прототип</button>
           </form>
        </div>
      )}
    </div>
  );
}

export default App;