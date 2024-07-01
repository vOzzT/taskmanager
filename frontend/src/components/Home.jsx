import { Link } from 'react-router-dom'

function Home() {

    return (
        <div className='Composition'>

            <div className="black_sideline">
            </div>


            <div className = "card">
                <h1 className = "card-title">NAME OF APP</h1>
                <hr/>
                <Link to ="/login"><button className="homeButton">LOGIN</button></Link>
                <hr/>
                <Link to ="/signup"><button className="homeButton">SIGN UP</button></Link>
                <hr/>
                <a href="https://github.com/vOzzT/taskmanager"><button className="homeButton">GITHUB</button></a>
                <hr/>
            </div>
        </div>
    );
}

export default Home