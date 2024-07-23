import '../css/index.css'


function Home() {

    return (
        <div className='Composition'>

            <div className="black_sideline">
            </div>


            <div className = "card">
                <h1 className = "card-title">Task Manager</h1>
                <hr/>
                <button className="homeButton">LOGIN</button>
                <hr/>
                <button className="homeButton">SIGN UP</button>
                <hr/>
                <a href="https://github.com/vOzzT/taskmanager"><button className="homeButton">GITHUB</button></a>
                <hr/>
            </div>
        </div>
    );
}

export default Home
