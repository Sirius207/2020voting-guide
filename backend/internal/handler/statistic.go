package handler

import (
	"fmt"
	"net/http"

	"github.com/g0v/2020voting-guide/backend/internal/db"
	"github.com/g0v/2020voting-guide/backend/internal/models"

	"github.com/gin-gonic/gin"
)

// GetStatisticByNameHandler return statistic info
// @Summary get the statistic info by name, and can filter by term
// @Description get the statistic info by name, and can filter by term
// @Accept json
// @Produce json
// @Param name path string true "Name"
// @Success 200 {object} models.Statistic
// @Router /api/statistic/{name} [get]
func GetStatisticByNameHandler(c *gin.Context) {
	name := c.Param("name")
	term := 9

	var statisticResp models.StatisticResp
	var personalStatisticDb []db.Statistic

	statisticResp.Name = name

	db.MySQL.Where("name = ? AND term = ? AND dataType = ?", name, term, "categories").Find(&personalStatisticDb)
	for _, statisticObj := range personalStatisticDb {
		if statisticObj.StatisticType == "legal_proposal" {
			statisticResp.BillProposalCategory = append(statisticResp.BillProposalCategory, models.StatisticCategory{
				Name:  statisticObj.Key,
				Term:  statisticObj.Term,
				Count: statisticObj.Value,
			})
			statisticResp.BillProposalNum = statisticResp.BillProposalNum + statisticObj.Value
		}
		if statisticObj.StatisticType == "interpellation" {
			statisticResp.InterpellationCategory = append(statisticResp.InterpellationCategory, models.StatisticCategory{
				Name:  statisticObj.Key,
				Term:  statisticObj.Term,
				Count: statisticObj.Value,
			})
			statisticResp.InterpellationNum = statisticResp.InterpellationNum + statisticObj.Value
		}
	}

	var legislatorDb db.Legislator
	db.MySQL.Where("name = ? AND term = ?", name, "09").First(&legislatorDb)
	if legislatorDb.MaxSittingNum != 0 {
		statisticResp.SittingRate = float32(legislatorDb.SittingNum) / float32(legislatorDb.MaxSittingNum)
	}
	var contributeDb db.Contribution
	db.MySQL.Where("name = ?", name).First(&contributeDb)
	fmt.Println(contributeDb)
	statisticResp.Contribution.TotalIncome = contributeDb.TotalIncome
	statisticResp.Contribution.PersonalContributeion = contributeDb.PersonalContributeion
	statisticResp.Contribution.ProfitableContributeion = contributeDb.ProfitableContributeion
	statisticResp.Contribution.PartyContributeion = contributeDb.PartyContributeion
	statisticResp.Contribution.CivilOrganizationsContributeion = contributeDb.CivilOrganizationsContributeion
	statisticResp.Contribution.AnonymousContributeion = contributeDb.AnonymousContributeion
	statisticResp.Contribution.OtherContributeion = contributeDb.OtherContributeion
	statisticResp.Contribution.OverThrityThousandContribute = contributeDb.OverThrityThousandContribute
	statisticResp.Contribution.TotalExpense = contributeDb.TotalExpense

	var otherCandidateDb []db.Contribution
	db.MySQL.Where(
		"constituency = (?)",
		db.MySQL.Table("contribution").Select("constituency").Where("name = ?", name).QueryExpr(),
	).Find(&otherCandidateDb)
	fmt.Println(otherCandidateDb)
	statisticResp.OtherConstituencyCandidate = []models.StatisticOtherCandidate{}
	for _, candidate := range otherCandidateDb {
		statisticResp.OtherConstituencyCandidate = append(statisticResp.OtherConstituencyCandidate, models.StatisticOtherCandidate{
			Name:         candidate.Name,
			TotalIncome:  candidate.TotalIncome,
			TotalExpense: candidate.TotalExpense,
		})

	}
	fmt.Println(statisticResp)
	c.JSON(http.StatusOK, statisticResp)
}
