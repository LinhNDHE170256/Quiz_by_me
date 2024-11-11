import React from 'react';

function Home({ startSession }) {
    return (
        <div className="container text-center">
            <h1>Vocabulary Quiz</h1>
            <button className="btn btn-primary" onClick={startSession}>Học</button>
        </div>
    );
}

export default Home;
