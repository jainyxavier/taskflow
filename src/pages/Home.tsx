import PageHeader from "../components/PageHeader";
import EmptyTaskList from "../components/EmptyTaskList";
import Header from "../components/Header";

export default function Home() {
    return (
        <div className="flex min-h-dvh w-full flex-col bg-[#F3F1FF]">
            <Header />

            <main className="mx-auto flex w-full max-w-[1300px] flex-1 flex-col px-4 pb-8 sm:px-6 lg:px-8">
                <PageHeader />
                <EmptyTaskList />
            </main>
        </div>
    );
}
