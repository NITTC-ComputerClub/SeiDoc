import * as React from 'react'
import { SystemsState } from '../reducers/categorysReducer'
import { CategorysActions } from '../containers/categorysContainer'

type categoryProps = SystemsState & CategorysActions

const CategoryButton: React.FC<categoryProps> = (props: categoryProps) => {
    const categorys: Array<string> = [
        '子育て', '介護', '建築', '病気', '融資', '地域', '高齢者'
    ]
    return (
        <div>
            <div>
                {console.log(props)}
                <button onClick={() => props.fetchSystemByAlgoliaSearch("子育て")}>全文検索: 子育て</button>
                <div>
                    {categorys.map((category) => (
                        <button key={category} onClick={() => {
                            props.fetchSystemByCategory(category)
                            props.addTags(category)
                        }}>{category}</button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoryButton