import Draggable from 'react-draggable';

function WindowWithMenu({ dispatch, children }) {
  return (
    <Draggable>
      <div className="window active inline-block w-fit">
        <div className="title-bar w-full">
          <div className="title-bar-text flex w-fit items-center">
            <img src="assets/minesweeper/mine.png" className="h-auto w-4" />
            Minesweeper
          </div>
          <div className="title-bar-buttons flex shrink-0">
            {/* <button data-minimize="" /> */}
            {/* <button data-maximize="" /> */}
            <button data-close="" />
          </div>
        </div>

        <div className="window-body inline-block bg-[#c0c0c0]">
          <ul role="menubar" className="flex w-fit">
            <li
              tabIndex="0"
              aria-haspopup={true}
              className="group relative cursor-pointer"
            >
              <u>G</u>ame
              <ul
                role="menu"
                className="absolute left-0 hidden border border-gray-400 bg-white p-1 group-hover:block group-focus:block"
              >
                <li
                  tabIndex="0"
                  onClick={() =>
                    dispatch({ type: 'CHANGE_LEVEL', payload: 'beginner' })
                  }
                >
                  Beginner
                </li>
                <li
                  tabIndex="0"
                  onClick={() =>
                    dispatch({ type: 'CHANGE_LEVEL', payload: 'intermediate' })
                  }
                >
                  Intermediate
                </li>
                <li
                  tabIndex="0"
                  onClick={() =>
                    dispatch({ type: 'CHANGE_LEVEL', payload: 'expert' })
                  }
                >
                  Expert
                </li>
              </ul>
            </li>

            <li
              tabIndex="0"
              aria-haspopup={true}
              className="group relative cursor-pointer"
            >
              <u>H</u>elp
              <ul
                role="menu"
                className="absolute left-0 top-full hidden border border-gray-400 bg-white p-1 group-hover:block group-focus:block"
              >
                <li tabIndex="0">
                  <a
                    href="https://github.com/atris-Ctrl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Github
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          <div className="inline-block">{children}</div>
        </div>
      </div>
    </Draggable>
  );
}

export default WindowWithMenu;
