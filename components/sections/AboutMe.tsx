export default function AboutMe() {
  return (
    <section id="about-me" className="w-full bg-[#F0F0F0]">
      <div className="flex flex-col sm:flex-row w-full max-w-6xl mx-auto px-4 py-16 sm:px-14">
        <div
          id="dragon-landing"
          aria-hidden="true"
          className="relative mx-auto mb-8 aspect-square w-[min(72vw,280px)] shrink-0 sm:mb-0 sm:w-1/3 sm:self-center"
        />
        <div className="flex flex-col gap-4 w-full sm:w-2/3 text-base/7 sm:text-xl/8 break-keep">
          <p className="text-sm font-semibold text-neutral-600">About me</p>
          <p>
            UX/UI 디자이너로 화면을 그리다, 그 화면이 실제로 작동하게 만드는
            코드에 끌려 개발자가 되었습니다. 그래서 기획의 의도와 디자인의
            언어를 읽고, 그것을{" "}
            <span className="font-bold">
              코드로 옮기는 사이의 간극을 좁히는 일
            </span>
            을 가장 좋아합니다.
          </p>
          <p>
            기획이 비어 있을 때 멈추지 않고{" "}
            <span className="font-bold">요구사항부터 직접 정의해 끝까지</span>{" "}
            만들었습니다. 회사에서는 고정된 이벤트 화면을 관리자가 구성하는
            화면으로 바꿨고, 팀 프로젝트에서는 와이어프레임부터 다시 그려 6주
            안에 배포했습니다.
          </p>
          <p>
            AI로 빠르게 만들되,{" "}
            <span className="font-bold">직접 읽고 테스트할 수 있는 구조</span>를
            고릅니다. 혼자 잘하는 개발자보다{" "}
            <span className="font-bold">함께 일하기 편한 개발자</span>가 되고
            싶어, 팀이 매일 반복하는 일은 컨벤션과 자동화 도구로 바꿔 나갑니다.
          </p>
        </div>
      </div>
    </section>
  );
}
