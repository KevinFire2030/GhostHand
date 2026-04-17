# PLM API Guide

사내 PLM 시스템에 API로 문제점 및 로그 파일을 업로드하기 위한 가이드입니다.

## 배경

- 단말과 PLM 시스템은 서로 다른 네트워크를 사용함
- iPaaS(Integration Platform as a Service)를 통해 단말에서 PLM API로 문제점 및 로그 파일 업로드 예정

## Defect Registration (Request) / POST

| No. | Properties | Parameter Name | Data Type | Comments | MX |
|---|---|---|---|---|---|
| 1 | 사업부 코드 | divisionCode | VARCHAR2 (50) | Mobile(25), VD(11), Network(26), LIV(14) | Mandatory |
| 2 | 외부시스템 코드 | systemCode | VARCHAR2 (100) | The own code of the system calling the PLM API | Mandatory |
| 3 | Defect 처리 구분 | changeType | VARCHAR2 (50) | Defect registration type : `DRAFT` / `OPEN`<br>※ You should contact PLM manager before using `OPEN` option | Mandatory |
| 4 | 과제/모델 명 | refObjectName | VARCHAR2 (500) | The name of Project / Model / Separate Test | Mandatory |
| 5 | 과제/모델 유형 | refObjectType (= Project/Model Type) | VARCHAR2 (50) | Preceding (선행): `PRE`<br>Basic Comm.(선행 상품화): `BASIC`<br>Set (SET개발): `DEV`<br>SW Product (SW 제품): `SW`<br>Support Project (지원과제): `SUPPORT`<br>Maintenance: `ITEM`<br>Manufacturing Model (양산모델): `MFG`<br>Separate Test (개별시험): `ETC`<br>SW Dev (SW DEV): `SWREL` | Mandatory |
| 6 | 외부시스템 문제점 ID | externalDefectId | VARCHAR2 (50) | The own ID of defect to use as PK in external System | Mandatory |
| 7 | 문제유형 | defectCategory | VARCHAR2 (50) | [Defect Type] H/W (HW), S/W (SW), Mechanic (MW) | Mandatory |
| 8 | 문제점등록자 | createUser | VARCHAR2 (50) | Knox Portal ID of registrant | Mandatory |
| 9 | 제목 | title | VARCHAR2 (300) | Title of defect | Mandatory |
| 10 | 해결담당자 | inChargeUser | VARCHAR2 (4000) | In charge user list ※ The first user will be the main owner | Mandatory |
| 11 | 문제점 | content | VARCHAR2 (4000) | Content of defect | Mandatory |
| 12 | 발생/재현경로 | reappearancePath | VARCHAR2 (4000) | Reappearance Path |  |
| 13 | 예상결과 | forecastResult | VARCHAR2 (4000) | Expected Result |  |
| 14 | 중요도 | importance | VARCHAR2 (50) | Defect Priority (A / B / C) | Mandatory |
| 15 | 발생빈도 | occurRateType | VARCHAR2 (100) | Occurrence Rate (Always / Sometimes / Once) | Mandatory |
| 16 | 발생빈도 분자 | occurCount | VARCHAR2 (10) | (If Occurrence Rate is Sometimes) The number of occurrences |  |
| 17 | 발생빈도 분모 | occurTryTotal | VARCHAR2 (10) | (If Occurrence Rate is Sometimes) The number of attempts |  |
| 18 | 발생단계 | occurPhase | VARCHAR2 (50) | Select the stage(phase) for each Project Type:<br>Preceding (선행): CA, ER1, ER2<br>Basic Comm (선행상품화): BC<br>Set (SET 개발): Preceding, DV, PV, PR, SR, ETC<br>SW Product (SW 제품): ETC<br>Support Projects (지원과제): Complete<br>Maintenance: Development<br>Manufacturing Model: SR, ETC<br>Separate Test (개별시험): ETC<br>SW Dev: SWDEVELOP | Mandatory |
| 19 | 시험처 | testUnit | VARCHAR2 (300) | The name of test unit | Mandatory |
| 20 | 시험분류 | testCategory | VARCHAR2 (300) | The name of test category (Mobile Division only) |  |
| 21 | 시험항목 | testItem | VARCHAR2 (300) | The name of test item | Mandatory |
| 22 | 성격분류 | classification | VARCHAR2 (300) | Characteristics of defect (Mobile Division only)<br>→ Performance/Quality, Manufacturing/Process, UX(concept), Translation, Data Request, Samsung Connect |  |
| 23 | 발생Block | functionBlock | VARCHAR2 (300) | Occurrence Block<br>※ Occurrence Block is a value that depends on the TestUnit. ※ Refer to the page for problem registration | Mandatory |
| 24 | Feature | detailFunctionclass | VARCHAR2 (300) | Feature Name<br>※ Feature is a value that depends on the occurrence block | Mandatory |
| 25 | 발생유형 | occurType | VARCHAR2 (300) | Occurrence Type ※ Refer to the page for problem registration |  |
| 26 | Defect Type | defectType | VARCHAR2 (300) | Defect Type ※ Refer to the page for problem registration |  |
| 27 | 현상분류 | failureType | VARCHAR2 (300) | Appearance Classification ※ Refer to the page for problem registration |  |
| 28 | 세부현상 | detailProblemType | VARCHAR2 (300) | Detailed Failure Situation ※ Refer to the page for problem registration |  |
| 29 | Test Case | testCaseYn | VARCHAR2 (1) | Test Case Y/N |  |
| 30 | Test Case ID | testCaseId | VARCHAR2 (100) | Test Case ID |  |
| 31 | 등록 S/W Ver. | swVersion | VARCHAR2 (200) | S/W Version for test |  |
| 32 | H/W Ver. | hwVersion | VARCHAR2 (50) | H/W Version for test |  |
| 33 | 검토부서 | reviewDept | VARCHAR2 (300) | Review Department (Mobile division, CS problem only) |  |
| 34 | 검토결과 | reviewwResult | VARCHAR2 (300) | Review Result (Mobile Division, CS problem Only)<br>→ Draft / Not Revw. / Duplication / Maintain current status / Open |  |
| 35 | 검토자 | reviewerId | VARCHAR2 (50) | Knox portal ID of reviewer |  |
| 36 | 개발/검증 문제점 구분 | isDevVerify | VARCHAR2 (1) | Development Defect: Y<br>Test Defect (by CS): N |  |
| 37 | 외부 문제점 첨부파일 존재 여부 | docAttachedYn | VARCHAR2 (1) | If you have any attachments: Y, or select N |  |
| 38 | Gating Y/N | gatingYn | VARCHAR2 (1) | Indicates whether it is a Gating issue. This field is only for `Test Manufacturing` and `Manufacturing Engineering` |  |
| 39 | Package Name | contentsName | VARCHAR2 (1500) | This field is for managing 3rd party app information. This field is only for `S/W Engineering`, `S/W Engineering_App Test`, `S/W Engineering_UT`, and `H/W UT` test unit. |  |
| 40 | App Version | contentsVersion | VARCHAR2 (200) | This field is for managing 3rd party app information. This field is only for `S/W Engineering`, `S/W Engineering_App Test`, `S/W Engineering_UT`, and `H/W UT` test unit. |  |
| 41 | Note (ETC) | contentsEtc | VARCHAR2 (500) | This field is for managing 3rd party app information. This field is only for `S/W Engineering`, `S/W Engineering_App Test`, `S/W Engineering_UT`, and `H/W UT` test unit. |  |
| 42 | Customer | customer | VARCHAR2 (50) |  |  |
| 43 | Category | category | VARCHAR2 (50) |  |  |
| 44 | Detected Phase | detectedPhase | VARCHAR2 (50) |  |  |
| 45 | Detection Method | detectionMethod | VARCHAR2 (50) |  |  |
| 46 | Defect Type | additionalInfo | VARCHAR2 (50) |  |  |
| 47 | 제품유형 | prodType | VARCHAR2 (50) |  |  |
| 48 | 조사의뢰 | btspTechnicalSurvey | VARCHAR2 (1) |  |  |
| 49 | Feature ID (등록) | detailFunctionclassId | VARCHAR2 (600) |  |  |
| 50 | Technology | btspTechnology | VARCHAR2 (300) |  |  |
| 51 | 제품정보 | btspSystemType | VARCHAR2 (300) |  |  |
| 52 | Sub System (등록) | subsystem | VARCHAR2 (300) |  |  |
| 58 | site | site | VARCHAR2 (300) |  |  |
| 59 | Customer Priority | btspCustomerPriority | VARCHAR2 (600) | ※ Network 사업부 - BTSP 시스템 입력값 |  |
| 60 | 발생일시 | btspOccurrenceDate | DATE | ※ Network 사업부 - BTSP 시스템 입력값 |  |
| 61 | Sub Status | btspSubStatus | VARCHAR2 (600) | ※ Network 사업부 - BTSP 상태값 |  |
| 62 | verifyUser | verifyUser | VARCHAR2 (4000) | 검증자 |  |
| 63 | Model No | modelNumber | VARCHAR2 (50) | [MX]<br>This field is only for `Global VOC`, `Global VOC(현물)` test unit.<br><br>[VD]<br>- 의뢰사유 `양산단계 이슈개선` 개별시험 문제점등록 항목<br>- MES 시스템에서 Draft 상태로 문제점 등록 API 호출시 `문제점발생 모델코드` parameter 추가 (option) | Mandatory |
| 64 | OS Ver | osVersion | VARCHAR2 (50) | This field is only for `Global VOC`, `Global VOC(현물)` test unit.<br>시험처 GLOBAL_VOC / Global VOC(현물) 이고, 발생유형이 `Big Data` 인 경우 필수체크 제외 | Mandatory |
| 65 | Nation(Location) | nation | VARCHAR2 (300) | This field is only for `Global VOC`, `Global VOC(현물)` test unit.<br>시험처 GLOBAL_VOC / Global VOC(현물) 이고, 발생유형이 `Big Data` 인 경우 필수체크 제외 | Mandatory |
| 66 | 증상분류(대) | symptomType1 | VARCHAR2 (300) | This field is only for `Global VOC`, `Global VOC(현물)` test unit.<br>시험처 GLOBAL_VOC / Global VOC(현물) 이고, 발생유형이 `Big Data` 인 경우 필수체크 제외 | Mandatory |
| 67 | 증상분류(중) | symptomType2 | VARCHAR2 (300) | This field is only for `Global VOC`, `Global VOC(현물)` test unit.<br>시험처 GLOBAL_VOC / Global VOC(현물) 이고, 발생유형이 `Big Data` 인 경우 필수체크 제외 | Mandatory |
| 68 | 증상분류(소) | symptomType3 | VARCHAR2 (300) | This field is only for `Global VOC`, `Global VOC(현물)` test unit.<br>시험처 GLOBAL_VOC / Global VOC(현물) 이고, 발생유형이 `Big Data` 인 경우 필수체크 제외 | Mandatory |
| 69 | IMEI | csImei | VARCHAR2 (300) |  |  |
| 70 | S/N | csSn | VARCHAR2 (300) |  |  |
| 71 | 서비스 유형 | serviceType | VARCHAR2 (300) | 수리 / 반품 |  |
| 72 | 발생권역 | occurRegion | VARCHAR2 (300) | 구주, 동남아, 서남아, 북미, 한국, 일본, 중국 본토, CIS, 중동, 아프리카, 중남미 |  |
| 73 | 발생법인 | occurCorp | VARCHAR2 (300) |  |  |
| 74 | 등록법인 | registerCorp | VARCHAR2 (300) | SIEL, HQ, SEHZ, SEV, SEVT |  |
| 75 | 불량접수일 | badReceiptDate | Date | yyyy.mm.dd |  |
| 76 | 불량입수일 | badIngestDate | Date | yyyy.mm.dd |  |
| 77 | TC NO. | tcNo | VARCHAR2 (300) | S/W 문제점인 경우 필수 |  |
| 78 | Must Fix | mustFix | VARCHAR2 (1) | Y/N<br>MX: 개별시험 의뢰사유 MR Issue, +1 SW 일때 Must Fix 필수. 개별시험 의뢰사유 상시폴더 일때 default `N` |  |
| 79 | CC List | ccList | VARCHAR2 (4000) | CC List<br>ex) knoxId1, knoxId2, knoxId3…. |  |
| 80 | 문제점 편집기 입력 Y/N | isEditorYn | VARCHAR2 (1) | 디폴트 `Y` |  |
| 81 | 발생/재현경로 편집기 입력 Y/N | isPatheditorYn | VARCHAR2 (1) | 디폴트 `Y` |  |
| 82 | 예상결과 편집기 입력 Y/N | isResulteditorYn | VARCHAR2 (1) | 디폴트 `Y` |  |
| 83 | One UI Ver.(Test) | oneUiVerTest | VARCHAR2 (300) | * MX: 개별시험 의뢰사유 MR Issue, +1 SW 이고 Open 시 필수<br>- 기준정보 PLM 화면 확인 |  |
| 84 | One UI Ver.(Target) | oneUiVerTarget | VARCHAR2 (300) | * MX: 개별시험 의뢰사유 MR Issue, +1 SW 이고 Open 시 필수<br>- 기준정보 PLM 화면 확인 |  |
| 85 | 검증방법 | verificationMethod | VARCHAR2 (50) | TC, HT, AUTO, UT, VoC, IxD, Others |  |
| 86 | Automation Tool | toolName | VARCHAR2 (600) |  |  |
| 87 | 발생언어 | occurLanguage | VARCHAR2 (1000) | Austria, Denmark, Finland, France, Germany, Greece, Italy, Netherland, Norway, Spain, Sweden, Switzerland, Czech-Republic, United_Kingdom<br>ex) 멀티입력가능: `Austria,Denmark,Finland` |  |
| 88 | Checksum | checksum | VARCHAR2 (50) |  |  |
| 89 | 샘플 Serial No. | serialNo | VARCHAR2 (1000) |  |  |
| 90 | 3rd Party Issue 여부 | thirdPartyIssueYn | VARCHAR2 (1) | 디폴트 `N` |  |
| 91 | 3rd Party Issue | thirdPartyIssue | VARCHAR2 (500) | 3rd Party Issue 여부 = `Y`일 때 입력 |  |

## Defect Registration (Return) / JSON

| No. | Properties | Parameter Name | Data Type | Comments | Option |
|---|---|---|---|---|---|
| 1 | 외부 문제점 ID | externalDefectId | VARCHAR2 (50) | The own ID of defect to use as PK in external System.<br>(This id is entered when registering the problem) |  |
| 2 | PLM 문제점 ID | defectId | VARCHAR2 (18) | The own ID of PLM defect |  |
| 3 | PLM 문제점 사례코드 | defectCode | VARCHAR2 (50) | Case Code (ex, P180101-00001) |  |
| 4 | IF 성공여부 | success | Boolean | IF Flag (T / F) |  |
| 5 | 리턴 메시지 | message | VARCHAR2 (300) | Return message |  |

## Sample Code

### HTTP Sample

```text
http://10.195.55.11:8080/plmapi/broker.do?singleId=bhui.lee&appId=SR_SE&userLang=en&serviceCode=IF_OUTER_TO_PLM_DEFECT&param={"divisionCode":"25","systemCode":"YourOwnSystemCode","changeType":"DRAFT","refObjectName":"SM-A310D_JPN_DCM","refObjectType":"DEV", "externalDefectId":"YourOwnDefectId(Unique ID)_0001","defectCategory":"S/W","createUser":"bhui.lee","title": "API TEST 2021 08 12","inChargeUser":"bhui.lee","content":"Description about defect","reappearancePath":"Reappearance path information","forecastResult":"Forecast Result Information","importance":"B","occurRateType":"Sometimes","occurCount":"5","occurTryTotal":"10","occurPhase":"PR","testUnit":"S/W Engineering","testCategory":"[Mobile]","testItem":"Activation Test","classification":"Performance/Quality","functionBlock":"Basic App","detailFunctionclass":"Recent","occurType":"[HQ]Multimedia App","defectType":"Code Defect","failureType":"FUNCTION","detailProblemType":"Not Run","testCaseYn":"N","testCaseId":"","swVersion":"SC04JOMU0AQC5/JDCM0AQC5","hwVersion":"","reviewDept":"S/W Quality Engineering Group","reviewResult":"Not Revw.","reviewerId":"bhu.lee","isDevVerify":"N","docAttachedYn":"N", "verifyUser":"hyuna45.lee,youngam.jo"}
```

### HTTP Sample (Global VOC)

```text
http://10.195.55.11:8080/plmapi/broker.do?singleId=bhui.lee&appId=SR_SE&userLang=en&serviceCode=IF_OUTER_TO_PLM_DEFECT&param={"divisionCode":"25","systemCode":"YourOwnSystemCode","changeType":"DRAFT","refObjectName":"SM-A310D_JPN_DCM","refObjectType":"DEV", "externalDefectId":"YourOwnDefectId(Unique ID)_0001","defectCategory":"S/W","createUser":"bhui.lee","title": "API TEST 2021 08 12","inChargeUser":"bhui.lee","content":"Description about defect","reappearancePath":"Reappearance path information","forecastResult":"Forecast Result Information","importance":"B","occurRateType":"Sometimes","occurCount":"5","occurTryTotal":"10","occurPhase":"PR","testUnit":"S/W Engineering","testCategory":"[Mobile]","testItem":"Activation Test","classification":"Performance/Quality","functionBlock":"Basic App","detailFunctionclass":"Recent","occurType":"[HQ]Multimedia App","defectType":"Code Defect","failureType":"FUNCTION","detailProblemType":"Not Run","testCaseYn":"N","testCaseId":"","swVersion":"SC04JOMU0AQC5/JDCM0AQC5","hwVersion":"","reviewDept":"S/W Quality Engineering Group","reviewResult":"Not Revw.","reviewerId":"bhu.lee","isDevVerify":"N","docAttachedYn":"N", "verifyUser":"hyuna45.lee,youngam.jo", "modelNumber":"YP-T7JZ/XAA", "osVersion":"12", "nation":"US", "symptomType1":"화면", "symptomType2":"흑화", "symptomType3":"화면 흑화"}
```

### Curl Sample

```bash
curl --noproxy '*' http://10.195.55.11:8080/plmapi/broker.do \
  --data-urlencode "singleId=bhui.lee" \
  --data-urlencode "appId=SR_SE" \
  --data-urlencode "userLang=KO" \
  --data-urlencode "serviceCode=IF_OUTER_TO_PLM_DEFECT" \
  --data-urlencode "param={'divisionCode':'25','systemCode':'YourOwnSystemCode','changeType':'DRAFT','refObjectName':'SM-A310D_JPN_DCM','refObjectType':'DEV', 'externalDefectId':'YourOwnDefectId(Unique ID)_0001','defectCategory':'S/W','createUser':'bhui.lee','title':'API TEST 2021 08 12','inChargeUser':'bhui.lee','content':'Description about defect','reappearancePath':'Reappearance path information','forecastResult':'Forecast Result Information','importance':'B','occurRateType':'Sometimes','occurCount':'5','occurTryTotal':'10','occurPhase':'PR','testUnit':'S/W Engineering','testCategory':'[Mobile]','testItem':'Activation Test','classification':'Performance/Quality','functionBlock':'Basic App','detailFunctionclass':'Recent','occurType':'[HQ]Multimedia App','defectType':'Code Defect','failureType':'FUNCTION','detailProblemType':'Not Run','testCaseYn':'N','testCaseId':'','swVersion':'SC04JOMU0AQC5/JDCM0AQC5','hwVersion':'','reviewDept':'S/W Quality Engineering Group','reviewResult':'Not Revw.','reviewerId':'bhu.lee','isDevVerify':'N','docAttachedYn':'N', 'verifyUser':'hyuna45.lee,youngam.jo'}"
```

## Response (JSON)

```json
{
  "status": {
    "message": "",
    "errorCode": "",
    "code": "PLM_API_00"
  },
  "result": {
    "message": "DEFECT REG SUCCESS",
    "defectId": "00DYWIHWNtPMWL1000",
    "externalDefectId": "TEST_DEFECT_ID_0316_01",
    "success": true,
    "defectCode": "P180316-00003"
  }
}
```
