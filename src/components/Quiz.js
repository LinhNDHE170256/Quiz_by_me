import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Quiz({ endSession }) {
    const [questions, setQuestions] = useState([]);  // Danh sách câu hỏi
    const [currentQuestion, setCurrentQuestion] = useState(0);  // Câu hỏi hiện tại
    const [selectedAnswer, setSelectedAnswer] = useState(null);  // Đáp án đã chọn
    const [wrongAnswers, setWrongAnswers] = useState(
        JSON.parse(localStorage.getItem('wrongAnswers')) || []  // Câu hỏi sai từ phiên trước
    );
    const [session, setSession] = useState(
        parseInt(localStorage.getItem('session')) || 1  // Phiên học hiện tại, mặc định là 1
    );
    const [showWrongAnswers, setShowWrongAnswers] = useState(true); // Để hiển thị câu hỏi sai trước

    // Lấy câu hỏi từ API khi phiên học thay đổi
    useEffect(() => {
        fetchQuestions();
    }, [session]);

    // Hàm lấy câu hỏi của phiên hiện tại
    const fetchQuestions = async () => {
        const response = await fetch('http://localhost:9999/questions');
        const data = await response.json();
        const start = (session - 1) * 20;  // Lấy 20 câu của phiên học hiện tại
        const end = session * 20;
        const currentQuestions = data.slice(start, end);

        setQuestions([...wrongAnswers, ...currentQuestions]);  // Câu hỏi sai trước, sau đó mới câu hỏi mới
    };

    // Xử lý khi người dùng chọn đáp án
    const handleAnswer = (option) => {
        setSelectedAnswer(option);
        const current = questions[currentQuestion];

        if (option === current.answer) {
            removeWrongAnswer(current);  // Xóa câu sai nếu trả lời đúng
        } else {
            saveWrongAnswer(current);  // Lưu câu hỏi sai nếu trả lời sai
        }

        setTimeout(() => {
            nextQuestion();
        }, 2000);
    };

    // Lưu câu hỏi sai vào localStorage (chỉ lưu lần đầu tiên)
    const saveWrongAnswer = (question) => {
        setWrongAnswers((prev) => {
            if (!prev.some(q => q.id === question.id)) {
                const updated = [...prev, question];
                localStorage.setItem('wrongAnswers', JSON.stringify(updated));
                return updated;
            }
            return prev;  // Nếu đã có câu hỏi trong danh sách, không thêm lại
        });
    };

    // Xóa câu hỏi sai khỏi localStorage
    const removeWrongAnswer = (question) => {
        setWrongAnswers((prev) => {
            const updated = prev.filter((q) => q.id !== question.id);
            localStorage.setItem('wrongAnswers', JSON.stringify(updated));
            return updated;
        });
    };

    // Chuyển sang câu hỏi tiếp theo
    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);  // Reset lựa chọn khi chuyển câu hỏi mới
        } else {
            endSessionPrompt();
        }
    };

    // Hiển thị thông báo khi kết thúc phiên học
    const endSessionPrompt = () => {
        const choice = window.confirm("Bạn có muốn học tiếp?");
        if (choice) {
            setSession(session + 1);  // Tăng số phiên
            localStorage.setItem('session', session + 1);
            setCurrentQuestion(0);  // Bắt đầu lại từ câu hỏi đầu
            setShowWrongAnswers(true);  // Đặt lại cờ để hiển thị câu sai
            fetchQuestions();
        } else {
            localStorage.removeItem('wrongAnswers');
            localStorage.removeItem('session');
            endSession();  // Quay về trang chủ
        }
    };

    // Xử lý lớp button
    const getButtonClass = (option) => {
        if (selectedAnswer === null) return 'btn-primary';
        if (option === selectedAnswer) {
            return option === questions[currentQuestion].answer ? 'btn-success' : 'btn-danger';
        }
        return option === questions[currentQuestion].answer ? 'btn-success' : 'btn-primary';
    };

    return (
        <Container style={{ maxWidth: '500px', border: '1px solid #ccc', padding: '20px', backgroundColor: 'white', borderRadius: '8px', marginTop: '20px' }}>
            {wrongAnswers.some(q => q.id === questions[currentQuestion]?.id) && showWrongAnswers && (
                <div style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>
                    Trả lời lại câu sai
                </div>
            )}
            <h5 style={{ textAlign: 'left', marginBottom: '20px' }}>
                Câu {questions[currentQuestion]?.id}: {questions[currentQuestion]?.question}
            </h5>

            <Row className="d-flex justify-content-center">
                <Col md={6}>
                    <Row>
                        <Col md={12}>
                            <button
                                className={`btn btn-block ${getButtonClass(questions[currentQuestion]?.options[0])}`}
                                style={{ width: '100%', marginBottom: '10px', color: 'white', minHeight: '50px' }}
                                onClick={() => handleAnswer(questions[currentQuestion]?.options[0])}
                                disabled={selectedAnswer !== null}
                            >
                                {questions[currentQuestion]?.options[0]}
                            </button>
                        </Col>
                        <Col md={12}>
                            <button
                                className={`btn btn-block ${getButtonClass(questions[currentQuestion]?.options[1])}`}
                                style={{ width: '100%', marginBottom: '10px', color: 'white', minHeight: '50px' }}
                                onClick={() => handleAnswer(questions[currentQuestion]?.options[1])}
                                disabled={selectedAnswer !== null}
                            >
                                {questions[currentQuestion]?.options[1]}
                            </button>
                        </Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col md={12}>
                            <button
                                className={`btn btn-block ${getButtonClass(questions[currentQuestion]?.options[2])}`}
                                style={{ width: '100%', marginBottom: '10px', color: 'white', minHeight: '50px' }}
                                onClick={() => handleAnswer(questions[currentQuestion]?.options[2])}
                                disabled={selectedAnswer !== null}
                            >
                                {questions[currentQuestion]?.options[2]}
                            </button>
                        </Col>
                        <Col md={12}>
                            <button
                                className={`btn btn-block ${getButtonClass(questions[currentQuestion]?.options[3])}`}
                                style={{ width: '100%', marginBottom: '10px', color: 'white', minHeight: '50px' }}
                                onClick={() => handleAnswer(questions[currentQuestion]?.options[3])}
                                disabled={selectedAnswer !== null}
                            >
                                {questions[currentQuestion]?.options[3]}
                            </button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <button
                className="btn btn-info"
                style={{ marginTop: '20px' }}
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
            >
                Next
            </button>
        </Container>
    );
}

export default Quiz;
