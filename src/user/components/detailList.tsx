import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { updateDetailCreator } from '../../actions/action'
import { AppState } from '../../store'
import Indicator from './indicator'
import { fireStore, systemIndex } from '../../firebase/firebase';
import { detailPageLogger } from '../../firebase/logger'
import { System } from '../../types/type';
import "../../scss/detail.scss"



const DetailList: React.FC<{ documentId: string }> = (props) => {
    const user = useSelector((state: AppState) => state.userState)
    let detail = useSelector((state: AppState) => state.detailState.detail)

    const dispatch = useDispatch()
    const updateDetail = (data: System) => dispatch(updateDetailCreator(data))
    let isLoading: boolean = false

    const isSystemLoaded = () => {
        // Nameだけでよさそう
        if ((detail.Name !== "") && (detail.Detail !== "") && (detail.Department !== "")) {
            return true
        } else {
            return false
        }
    }

    if (props.documentId !== detail.documentID) { //fetch
        isLoading = true
        detail.documentID = props.documentId    //無限ループ防止
        fireStore.collection(systemIndex).doc(props.documentId).get().then(res => {
            if (res.exists) {
                const detailData = res.data() as System
                updateDetail(detailData)
                isLoading = false
        }})
        .catch(err => console.error(err))
    }
    

    if (!isLoading && isSystemLoaded()) {   //等しいときはfetchなし
        if(!user.isAdmin && (user.nickName !== '')){
            console.log("Login user detected.")
            detail.totalView += 1;
            detail.dailyView += 1;
            detail.monthlyView += 1;
            detail.weeklyView[6]++;
            fireStore.collection(systemIndex)
                .doc(props.documentId)
                .update(detail)
                    .then(() => detailPageLogger(detail.documentID, user, detail))
            .catch(err => console.error(err))
        }else{
            console.log("This user is not logged in")
        }

        return (
            <div>
                <div className="detail">
                    <h1>{detail.Name}</h1>
                    <h2>援助対象者</h2>
                    <p className="detailParagraph">{detail.Target}</p>
                    <h2>援助方法</h2>
                    <p className="detailParagraph">{detail.Method}</p>
                    <h2>担当部署</h2>
                    <p className="detailParagraph">{detail.Department}</p>
                    <h2>詳細</h2>
                    <p className="detailParagraph">{detail.Detail}</p>
                    <div className="linkButton">
                        <a target="_blank" rel="noopener noreferrer" href={detail.Site}>
                            公式のページへ
                        </a>
                    </div>
                </div>
            </div>
        )
    } else {  //等しくないときはprops優先でfetch
        return (
            <Indicator />
        )
    }
}

export default DetailList