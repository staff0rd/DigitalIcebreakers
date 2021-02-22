using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class Poll : Game, IGame
    {
        protected virtual bool ShuffleAnswers => true;
        SelectableAnswers _lastAnswers;

        Dictionary<Player, List<SelectedAnswer>> _playerAnswers = new Dictionary<Player, List<SelectedAnswer>>();

        public Poll(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) { }

        public override async Task OnReceivePlayerMessage(JToken payload, string connectionId)
        {
            var player = GetPlayerByConnectionId(connectionId);
            var selectedAnswer = CacheAnswer(player, payload.ToObject<SelectedAnswer>());

            await SendToPresenter(connectionId, new[] { selectedAnswer }, player);
        }

        private SelectedAnswer CacheAnswer(Player player, SelectedAnswer selectedAnswer)
        {
            if (!_playerAnswers.ContainsKey(player))
            {
                _playerAnswers.Add(player, new List<SelectedAnswer>());
            }

            var answers = _playerAnswers[player];

            var existing = answers.FirstOrDefault(p => p.QuestionId == selectedAnswer.QuestionId);

            if (existing != null)
            {
                return existing;
            }

            answers.Add(selectedAnswer);

            return selectedAnswer;
        }

        public SelectedAnswer GetCachedAnswer(Player player, string questionId)
        {
            if (!_playerAnswers.ContainsKey(player))
            {
                return null;
            }
            return _playerAnswers[player]?.FirstOrDefault(p => p.QuestionId == questionId);
        }

        public async override Task OnReceivePresenterMessage(JToken payload, string connectionId)
        {
            var answers = payload.ToObject<SelectableAnswers>();
            if (answers != null)
            {
                _lastAnswers = answers;
                await SendToEachPlayer(connectionId, GetCurrentAnswersPayloadForPlayer);
            }
        }

        public async override Task OnReceiveSystemMessage(JToken payload, string connectionId)
        {
            string action = payload.ToString();
            if (action == "join")
            {
                var player = GetPlayerByConnectionId(connectionId);
                if (player != null)
                {
                    if (_lastAnswers != null)
                    {
                        await SendToPlayer(connectionId, GetCurrentAnswersPayloadForPlayer(player));
                    }
                }
                else
                {
                    var admin = GetAdminByConnectionId(connectionId);
                    if (admin != null)
                    {
                        var cached = _playerAnswers.Select(a => SendToPresenter(connectionId, a.Value.ToArray(), a.Key));
                        await Task.WhenAll(cached.ToArray());
                    }
                }
            }
        }

        private SelectableAnswers GetCurrentAnswersPayloadForPlayer(Player player)
        {
            return new SelectableAnswers
            {
                Answers = ShuffleAnswers ? _lastAnswers.Answers.Shuffle().ToArray() : _lastAnswers.Answers.ToArray(),
                QuestionId = _lastAnswers.QuestionId,
                SelectedAnswerId = GetCachedAnswer(player, _lastAnswers.QuestionId)?.AnswerId,
                Question = _lastAnswers.Question,
            };
        }
    }
}
