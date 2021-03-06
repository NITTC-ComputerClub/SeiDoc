import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../../user/components/footer-pc";
import styled from "styled-components";
import Button from "../../designSystem/Button";
import { fireStore, systemIndex } from '../../firebase/firebase';
import { System } from '../../types/type';
import _ from "lodash";
import { Wrapper, MainContents, Container } from "../../designSystem/Page";
import setting from "../../designSystem/setting";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import { AppState } from "../../store";

const Select = styled.select`
  width: 100%;
  height: 36px;
  margin-bottom: 16px;
  padding: 8px;
  border-radius: 2px;
  border: none;
  vertical-align: middle;
  background-color: ${setting.Gray5}
`;

const Form = styled.div`
  width: 100%;
  background-color: ${setting.White};
  border-radius: 4px;
  overflow: hidden;
  box-sizing: border-box;
  margin-top: 32px;
  padding: 32px 16px;
  text-align: center;
`

const InputWrapper = styled.div`
  max-width: 460px;
  margin: 0 auto;
  width: 100%;
  text-align: left;
  
  * {
      box-sizing: border-box;
  }
`

const Title = styled.h1`
  font-size: ${setting.H1};
`

const SubTitle = styled.h2`
  font-size: ${setting.H2};
`

const Checkbox = styled.div`
  font-size: ${setting.P1};
  text-align: center;
  margin: 0 auto 8px auto;
  width: 216px;
  display: flex;
  justify-content: space-between;
`

const ButtonWrapper = styled.div`
  text-align: right;
  margin-top: 64px;
`

const CSVDownload: React.FC = () => {
  const user = useSelector((state: AppState) => state.userState)

  const [category, setCategory] = useState<string>("すべて");
  const [isName, setIsName] = useState<boolean>(true);
  const [isCategory, setIsCategory] = useState<boolean>(true);
  const [isTarget, setIsTarget] = useState<boolean>(true);
  const [isDepartment, setIsDepartment] = useState<boolean>(true);
  const [isDetail, setIsDetail] = useState<boolean>(true);
  const [isOfficialURL, setIsOfficialURL] = useState<boolean>(true);
  const [isMethod, setIsMethod] = useState<boolean>(true);

  const json2csv = (json: Partial<System>[]) => {
    const header = Object.keys(json[0]).join(",") + "\n";
    const body = json
      .map(d => {
        return Object.keys(d)
          .map(key => {
            const query = key as  "Method" | "Category";
            const data = d[query] as Array<string>
            let replacedDetail: string = ""
            if (d.Detail !== undefined) {
              replacedDetail = d.Detail.replace(/,/g, '、')
            }
            d.Detail = replacedDetail
            if(data instanceof Array){
              return data.join('、')
            }else{
              return data
            }
          })
          .join(",");
      })
      .join("\n");
    return header + body;
  };

  const createCSV = (systemList: System[]) => {
    console.log("systemList", systemList.length, systemList);
    const query: string[] = [];

    if (isName) {
      query.push("Name");
    }
    if (isCategory) {
      query.push("Category");
    }
    if (isTarget) {
      query.push("Target");
    }
    if (isDepartment) {
      query.push("Department");
    }
    if (isDetail) {
      query.push("Detail");
    }
    if (isOfficialURL) {
      query.push("Site");
    }
    if (isMethod) {
      query.push("Method");
    }
    if(query.length < 1){
      alert("一つ以上の項目を選択してください。")
      return -1
    }

    const pickedData = systemList.map(system => {
      return _.pick(system, query);
    });
    const csv = json2csv(pickedData);
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, csv], { type: "text/csv" });
    const fileName = "data.csv";

    const a = document.createElement("a");
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.click();
    console.log("CSV出力完了！");
  };
  const handleSubmit = () => {
    const systemList: System[] = [];

    let getData = fireStore.collection(systemIndex).get()
    if (category !== "すべて"){
      getData = fireStore.collection(systemIndex).where("Category", "array-contains", category).get()
    }

    getData.then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data() as System;
        if((Object.keys(data).length === 20) && (data.Location === user.address)){
          systemList.push(doc.data() as System);
        }
      });
    })
    .then(() => {
      if(systemList.length > 1){
        createCSV(systemList)
      }else{
        alert("出力できるデータがありません。")
      }
    });
  };

  if (!user.isAdmin) {
    return (
      <Redirect to={'/admin/login'} />
    )
  }
  else
    return (
      <Wrapper>
        <Header />
        <Container>
          <MainContents>
            <Form>
              <Title>データ出力</Title>
              <InputWrapper>
                <div>
                  <SubTitle>データ内容</SubTitle>
                  <Select onChange={e => setCategory(e.target.value)}>
                    <option value="すべて">全カテゴリ</option>
                    <option value="子育て">子育て</option>
                    <option value="介護">介護</option>
                    <option value="建築">建築</option>
                    <option value="病気">病気</option>
                    <option value="融資">融資</option>
                    <option value="地域">地域</option>
                    <option value="高齢者">高齢者</option>
                    <option value="その他">その他</option>
                  </Select>
                </div>
                <div>
                  <SubTitle>データに含める項目</SubTitle>
                  {/* Name,Category,Target,Department,Detail,Site,Method */}
                  <Checkbox>
                    <label>制度名</label>
                    <input
                      type="checkbox"
                      checked={isName}
                      onChange={() => setIsName(!isName)}
                    />
                  </Checkbox>
                  <Checkbox>
                    <label>カテゴリ</label>
                    <input
                      type="checkbox"
                      checked={isCategory}
                      onChange={() => setIsCategory(!isCategory)}
                    />
                  </Checkbox>
                  <Checkbox>
                    <label>制度対象者</label>
                    <input
                      type="checkbox"
                      checked={isTarget}
                      onChange={() => setIsTarget(!isTarget)}
                    />
                  </Checkbox>
                  <Checkbox>
                    <label>担当部署</label>
                    <input
                      type="checkbox"
                      checked={isDepartment}
                      onChange={() => setIsDepartment(!isDepartment)}
                    />
                  </Checkbox>
                  <Checkbox>
                    <label>詳細</label>
                    <input
                      type="checkbox"
                      checked={isDetail}
                      onChange={() => setIsDetail(!isDetail)}
                    />
                  </Checkbox>
                  <Checkbox>
                    <label>公式サイト</label>
                    <input
                      type="checkbox"
                      checked={isOfficialURL}
                      onChange={() => setIsOfficialURL(!isOfficialURL)}
                    />
                  </Checkbox>
                  <Checkbox>
                    <label>援助方法</label>
                    <input
                      type="checkbox"
                      checked={isMethod}
                      onChange={() => setIsMethod(!isMethod)}
                    />
                  </Checkbox>
                </div>
                <ButtonWrapper>
                  <Button blue onClick={() => handleSubmit()}>CSVとして出力</Button>
                </ButtonWrapper>
              </InputWrapper>
            </Form>
          </MainContents>
        </Container>
        <Footer />
      </Wrapper>
    );
};

export default CSVDownload;
