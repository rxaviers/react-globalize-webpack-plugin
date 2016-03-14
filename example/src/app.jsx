import React from "react";
import ReactDOM from "react-dom";
import { FormatCurrency, FormatDate, FormatMessage, FormatNumber, FormatRelativeTime } from "react-globalize";

class App extends React.Component {
  render() {
    return <div>
      <div>
        <main>
          <p><FormatMessage>Use ReactGlobalize to internationalize your React application.</FormatMessage></p>
          <table style={{width: "100%", marginBottom: "1em"}}>
            <tbody>
              <tr>
                <td><FormatMessage>Standalone Number</FormatMessage></td>
                <td>"<FormatNumber options={{maximumFractionDigits: 2}}>{12345.6789}</FormatNumber>"</td>
              </tr>
              <tr>
                <td><FormatMessage>Standalone Currency</FormatMessage></td>
                <td>"<FormatCurrency currency="USD">{69900}</FormatCurrency>"</td>
              </tr>
              <tr>
                <td><FormatMessage>Standalone Date</FormatMessage></td>
                <td>"<FormatDate options={{datetime: "medium"}}>{new Date()}</FormatDate>"</td>
              </tr>
              <tr>
                <td><FormatMessage>Standalone Relative Time</FormatMessage></td>
                <td>"<FormatRelativeTime unit="second">{-35}</FormatRelativeTime>"</td>
              </tr>
            </tbody>
          </table>
          <p>
            <FormatMessage
              variables={{
                count: 3
              }}
            >{`
              An example of a message with pluralization support:
              {count, plural,
                  one {You have one remaining task}
                other {You have # remaining tasks}
              }
            `}</FormatMessage>
          </p>
          <p>
            <FormatMessage
              elements={{
                globalize: <a href="https://github.com/jquery/globalize/"></a>,
                reactGlobalize: <a href="https://github.com/kborchers/react-globalize"></a>,
                yarsk: <a href="https://github.com/bradleyboy/yarsk#yarsk"></a>
              }}
            >
            For more information, see [reactGlobalize]React Globalize
            Readme[/reactGlobalize], and [globalize]Globalize
            Readme[/globalize].
            </FormatMessage>
          </p>
        </main>
      </div>
    </div>;
  }
}

ReactDOM.render(React.createElement(App), document.getElementById("app"));

export default App;
