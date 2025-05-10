import { SquareProvider } from './context/SquareContext';
import Grid from './components/Grid';
import './App.css';

function App() {
    return (
        <SquareProvider>
            <div className="app-container">
                <header>
                    <h1>Kvadrat Generator</h1>
                    <p>Klicka på knappen för att lägga till kvadrater i rutnätet</p>
                </header>

                <main>
                    <Grid />
                </main>

                <footer>
                    <p>Wizardwork Square Challenge</p>
                </footer>
            </div>
        </SquareProvider>
    );
}

export default App;