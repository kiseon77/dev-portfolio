export default function AboutMe() {
  return (
    <section className="flex flex-col sm:flex-row w-full max-w-3xl mx-auto py-16">
      <div className="w-full sm:w-1/3">ㅇ</div>
      <div className="flex flex-col gap-3 w-full sm:w-2/3 font-base text-base/6 sm:text-xl/6 break-keep">
        <p>
          디자인은 좋은 경험을 그리는 일이었지만, 그 경험이 실제로 작동하게
          만드는 건 코드였습니다. 그래서 저는 기획의 의도를 읽고, 디자인의
          언어를 알아듣고, 그것을 코드로 옮기는 사이의 간극을 좁히는 일을
          좋아합니다.
        </p>
        <p>
          모르는 것 앞에서 멈추기보다는 먼저 배우는 쪽을 택합니다. 필요하면 낯선
          도구도 익혀서 결과로 만들어내고, 그 과정에서 발견한 문제는 끝까지
          붙잡고 풀어냅니다.
        </p>
        <p>
          혼자 하는 개발자보다, 함께 일하기 편한 개발자가 되고 싶습니다. 오늘도
          팀원들과 더 많이 대화하고, 더 나은 코드를 쓰기 위해 고민합니다.
        </p>
      </div>
    </section>
  );
}
