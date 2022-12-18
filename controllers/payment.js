export const markPaymentCompleted = async (req, res) => {
    const { applicantId, applicant } = req;
    applicant.paymentCompleted = true;
    await applicant.save();
    return res.status(200).json({ message: "Payment successful!" });
}