import CreateExpense from "@/components/expense/create-expense";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import fetcher from "@/utils/fetcher";
import { NextPage } from "next";
import useSWR from "swr";

const Expenses: NextPage = () => {
    const { data: friendsData, mutate: mutateFriend, isLoading: isFriendDataLoading } = useSWR<any>('/api/friend', fetcher);


    const { data: expenseData, mutate: mutateExpense } = useSWR<any>('/api/expense', fetcher);


    return (
        <div className="flex px-8 py-4 flex-col gap-4">
            <Card className="px-4">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Expenses
                        <CreateExpense friendsData={friendsData?.friends} />
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Expenses
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            {expenseData?.expenses?.map((expense: any) => (
                                <div key={expense._id} className="bg-secondary px-4 py-2 rounded-md border-1 flex flex-col gap-2">
                                    <div className="flex-1">
                                        Comments : {expense.comments !== '' ? expense.comments : 'No Comments'}
                                    </div>
                                    <div className="flex-1">
                                        Amount : {expense.amount}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Own Expenses
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            {expenseData?.own_expenses?.map((expense: any) => (
                                <div key={expense._id} className={`bg-secondary px-4 py-2 rounded-md border-1 flex flex-col gap-2 ${expense.settled ? 'bg-green-200 dark:bg-green-800' : ''}`}>
                                    <div className="flex-1">
                                        Comments : {expense.comments !== '' ? expense.comments : 'No Comments'}
                                    </div>
                                    <div className="flex-1">
                                        Amount : {expense.amount}
                                    </div>
                                    <div>
                                        Settled Amount : {expense.participants.reduce((acc: any, curr: any) => acc + curr.settled ? curr.share : 0, 0)}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>


                </CardContent>
            </Card>
        </div>
    )
}

export default Expenses;