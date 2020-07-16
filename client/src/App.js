import React from 'react';

import {BrowserRouter as Router, Route} from 'react-router-dom';

import Join from './components/Join';
import Calcuchat from './components/Calcuchat';

const App = () => (
    <Router>
        <Route path = "/" exact component = {Join} />
        <Route path = "/calcuchat" exact component = {Calcuchat} />
    </Router>
);

export default App;