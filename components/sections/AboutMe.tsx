export default function AboutMe() {
  return (
    <section className="w-full bg-[#F0F0F0]">
      <div className="flex flex-col sm:flex-row w-full max-w-6xl mx-auto px-4 py-16 sm:px-14">
        <div className="w-full sm:w-1/3"> </div>
        <div className="flex flex-col gap-3 w-full sm:w-2/3 font-base text-base/6 sm:text-xl/6 break-keep">
          <p>
            디자인은 좋은 경험을 그리는 일이었지만, 그 경험이 실제로 작동하게
            만드는 건 코드였습니다. 그래서 저는 기획의 의도를 읽고, 디자인의
            언어를 알아듣고, 그것을{" "}
            <span className="font-medium">
              {" "}
              코드로 옮기는 사이의 간극을 좁히는 일
            </span>
            을 좋아합니다.
          </p>
          <p>
            모르는 것 앞에서 멈추기보다는 먼저 배우는 쪽을 택합니다. 필요하면
            <span className="font-medium"> 낯선 도구도 익혀서 결과</span>로
            만들어내고, 그 과정에서 발견한 문제는 끝까지 붙잡고 풀어냅니다.
          </p>
          <p>
            혼자 하는 개발자보다,{" "}
            <span className="font-medium">함께 일하기 편한 개발자</span>가 되고
            싶습니다. 오늘도 팀원들과 더 많이 대화하고, 더 나은 코드를 쓰기 위해
            고민합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
