import React from 'react'
import { Route, Switch } from 'react-router-dom';
import Category from './user/pages/category'
import Search from './user/pages/search'
import Region from './user/pages/region'
import AdminInput from './admin/pages/newSystem'
import Detail from './user/pages/detail'
import ViewAll from './user/pages/viewAll'
import Top from './user/pages/top'
import Registration from './user/pages/registration';
import MoreDetails from './user/pages/moreDetails'
import Login from './user/pages/login'
import SignUp from './user/pages/userRegistration'
import Picute from './user/pages/picturePage'
import Finish from './user/pages/finishPage'
import AdminLogin from './admin/pages/login'
import AdminDetail from './admin/pages/detail'
import AdminSearch from './admin/pages/search'
import AdminTop from './admin/pages/top'
import AdminCategoryRanking from './admin/pages/categoryRanking'
import AdminTotalRanking from './admin/pages/totalRanking'
import CSVDownload from './admin/pages/csvDownload'
import NotFound from './admin/pages/notFound'
import './scss/App.scss'

import ML from './user/pages/machineLearning'

const App: React.FC = () => {
  return (
    <div>
      <Switch>
        <Route exact path='/' component={Top} />
        <Route path='/category' component={Category} />
        <Route path='/search' component={Search} />} />
        <Route path='/detail/:documentId' component={Detail} />
        <Route path='/login' component={Login} />
        <Route path='/signup' component={SignUp} />

        {/* MVP4で使えそう？ (inputとregistrationは機能被ってる)*/}
        <Route path='/view' component={ViewAll} />
        <Route path='/registration' component={Registration} />

        {/* MVP5 */}
        <Route path='/ml' component={ML} />
        <Route path='/picture' component={Picute} />
        <Route path='/finish' component={Finish} />
        <Route path='/region' component={Region} />
        <Route path='/moredetails' component={MoreDetails} />
        
        <Route path='/admin/login' component={AdminLogin} />
        <Route path='/admin/detail/:documentId' component={AdminDetail} />
        <Route path='/admin/newSystem' component={AdminInput} />
        <Route path='/admin/search' component={AdminSearch} />
        <Route path='/admin/download' component={CSVDownload} />
        <Route path='/admin/categoryRanking' component={AdminCategoryRanking} />
        <Route path='/admin/totalRanking' component={AdminTotalRanking} />
        <Route path='/admin/' component={AdminTop} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}

export default App;
